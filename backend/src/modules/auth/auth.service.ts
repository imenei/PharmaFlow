import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role === 'supplier' ? 'SUPPLIER' : 'PHARMACIST',
        status: 'PENDING',
        companyName: dto.companyName,
        phone: dto.phone,
        wilaya: dto.wilaya,
        address: dto.address,
      },
    });

    return this.buildAuthPayload(user, 'Account created');
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildAuthPayload(user, 'Authenticated');
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const payload = await this.jwtService.verifyAsync<{ sub: string; type: string }>(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'change-refresh-me'),
    });

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const record = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!record || !(await bcrypt.compare(refreshToken, record.tokenHash))) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    return this.buildAuthPayload(record.user, 'Token refreshed');
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokens = await this.prisma.refreshToken.findMany({
        where: { userId, revokedAt: null },
      });

      for (const token of tokens) {
        if (await bcrypt.compare(refreshToken, token.tokenHash)) {
          await this.prisma.refreshToken.update({
            where: { id: token.id },
            data: { revokedAt: new Date() },
          });
        }
      }
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return { success: true };
  }

  sanitizeUser(user: any) {
    const { passwordHash, ...safeUser } = user;
    return {
      ...safeUser,
      role: safeUser.role?.toLowerCase(),
      status: safeUser.status?.toLowerCase(),
    };
  }

  private async buildAuthPayload(user: any, message: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
      },
      {
        expiresIn: this.parseJwtTtl(this.configService.get<string>('JWT_ACCESS_TTL', '15m')),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        type: 'refresh',
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'change-refresh-me'),
        expiresIn: this.parseJwtTtl(this.configService.get<string>('JWT_REFRESH_TTL', '7d')),
      },
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: this.getExpiryFromTtl(this.configService.get<string>('JWT_REFRESH_TTL', '7d')),
      },
    });

    return {
      message,
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  private getExpiryFromTtl(ttl: string) {
    const match = ttl.match(/^(\d+)([dhm])$/i);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier =
      unit === 'd' ? 24 * 60 * 60 * 1000 : unit === 'h' ? 60 * 60 * 1000 : 60 * 1000;

    return new Date(Date.now() + value * multiplier);
  }

  private parseJwtTtl(value: string): number {
    const match = value.match(/^(\d+)([smhd])$/i);
    if (!match) {
      return 15 * 60;
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === 's') return amount;
    if (unit === 'm') return amount * 60;
    if (unit === 'h') return amount * 60 * 60;
    return amount * 24 * 60 * 60;
  }
}
