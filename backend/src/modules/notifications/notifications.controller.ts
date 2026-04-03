import { Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @CurrentUser() user: any,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @Query('unreadOnly') unreadOnly = 'false',
  ) {
    return this.notificationsService.getNotifications(user.id, Number(limit), Number(offset), unreadOnly === 'true');
  }

  @Get('stats')
  getStats(@CurrentUser() user: any) {
    return this.notificationsService.getStats(user.id);
  }

  @Patch(':id')
  markAsRead(@CurrentUser() user: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.id, id);
  }

  @Post('mark-all-read')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
