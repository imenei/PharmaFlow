import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

function extractJwtFromCookie(req: { cookies?: Record<string, string> }) {
  return req?.cookies?.pharma_access_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'change-me'),
    });
  }

  async validate(payload: { sub: string; role: string; email: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      status: user.status,
    };
  }
}
