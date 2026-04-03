import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    const { passwordHash, ...safe } = user;
    return {
      ...safe,
      role: safe.role.toLowerCase(),
      status: safe.status.toLowerCase(),
    };
  }
}
