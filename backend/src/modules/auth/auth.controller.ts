import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.register(dto);
    this.setAuthCookies(res, payload);
    return payload;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.login(dto);
    this.setAuthCookies(res, payload);
    return payload;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.pharma_refresh_token;
    const payload = await this.authService.refresh(token);
    this.setAuthCookies(res, payload);
    return payload;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.id, req.cookies?.pharma_refresh_token);
    this.clearAuthCookies(res);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return { user };
  }

  private setAuthCookies(res: Response, payload: { accessToken: string; refreshToken: string; user: any }) {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('pharma_access_token', payload.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('pharma_refresh_token', payload.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('pharma_role', payload.user.role, {
      httpOnly: false,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('pharma_status', payload.user.status, {
      httpOnly: false,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response) {
    for (const name of ['pharma_access_token', 'pharma_refresh_token', 'pharma_role', 'pharma_status']) {
      res.clearCookie(name, { path: '/' });
    }
  }
}
