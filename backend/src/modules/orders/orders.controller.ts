import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('api/v1/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(@CurrentUser() user: any) {
    return this.ordersService.getOrders(user);
  }

  @Post()
  createOrder(
    @CurrentUser() user: any,
    @Body() body: { supplierId: string; listingId?: string; notes?: string; totalItems?: number },
  ) {
    return this.ordersService.createOrder(user.id, body);
  }
}
