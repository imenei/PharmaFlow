import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('payments')
  getPayments() {
    return this.adminService.getPayments();
  }

  @Get('messages')
  getMessages() {
    return this.adminService.getMessages();
  }

  @Get('subscriptions')
  getSubscriptions() {
    return this.adminService.getSubscriptions();
  }

  @Post('check-subscriptions')
  checkSubscriptions() {
    return this.adminService.checkSubscriptions();
  }

  @Post('approve-subscription')
  approveSubscription(@Body('paymentId') paymentId: string) {
    return this.adminService.approveSubscription(paymentId);
  }

  @Post('reject-subscription')
  rejectSubscription(@Body('paymentId') paymentId: string) {
    return this.adminService.rejectSubscription(paymentId);
  }

  @Post('approve-user')
  approveUser(@Body('id') id: string) {
    return this.adminService.updateUserStatus(id, 'approved');
  }

  @Post('reject-user')
  rejectUser(@Body('id') id: string) {
    return this.adminService.updateUserStatus(id, 'rejected');
  }

  @Delete('delete-user')
  deleteUser(@Body('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Post('messages')
  handleMessages(@Body() body: { action: string; messageId: string }) {
    if (body.action === 'mark-read') {
      return this.adminService.markMessageAsRead(body.messageId);
    }
    return this.adminService.deleteMessage(body.messageId);
  }
}
