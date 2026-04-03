import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PharmacistsService } from './pharmacists.service';

@Controller('api/v1/pharmacists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('pharmacist', 'admin')
export class PharmacistsController {
  constructor(private readonly pharmacistsService: PharmacistsService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.pharmacistsService.getDashboard(user.id);
  }

  @Get('suppliers')
  getSuppliers(@Query('search') search?: string, @Query('wilaya') wilaya?: string) {
    return this.pharmacistsService.getSuppliers({ search, wilaya });
  }

  @Get('suppliers/:id')
  getSupplier(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pharmacistsService.getSupplierById(id, user.id);
  }

  @Get('offers')
  getOffers(@Query('search') search?: string) {
    return this.pharmacistsService.getOffers(search);
  }

  @Post('ratings')
  rateSupplier(@CurrentUser() user: any, @Body() body: { supplierId: string; score: number; comment?: string }) {
    return this.pharmacistsService.rateSupplier(user.id, body);
  }
}
