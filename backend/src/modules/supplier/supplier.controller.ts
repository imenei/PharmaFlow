import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SupplierService } from './supplier.service';

@Controller('api/v1/supplier')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('supplier', 'admin')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.supplierService.getDashboard(user.id);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.supplierService.getProfile(user.id);
  }

  @Put('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  updateProfile(@CurrentUser() user: any, @Body() body: Record<string, string>, @UploadedFile() avatar?: Express.Multer.File) {
    return this.supplierService.updateProfile(user.id, body, avatar);
  }

  @Get('listings')
  getListings(@CurrentUser() user: any) {
    return this.supplierService.getListings(user.id);
  }

  @Post('listings')
  @UseInterceptors(FileInterceptor('file'))
  createListing(@CurrentUser() user: any, @UploadedFile() file?: Express.Multer.File) {
    return this.supplierService.createListing(user.id, file);
  }

  @Delete('listings/:id')
  deleteListing(@CurrentUser() user: any, @Param('id') id: string) {
    return this.supplierService.deleteListing(user.id, id);
  }

  @Get('offers')
  getOffers(@CurrentUser() user: any) {
    return this.supplierService.getOffers(user.id);
  }

  @Post('offers')
  @UseInterceptors(FileInterceptor('image'))
  createOffer(@CurrentUser() user: any, @Body() body: Record<string, string>, @UploadedFile() image?: Express.Multer.File) {
    return this.supplierService.saveOffer(user.id, body, image);
  }

  @Put('offers/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateOffer(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: Record<string, string>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.supplierService.saveOffer(user.id, body, image, id);
  }

  @Delete('offers/:id')
  deleteOffer(@CurrentUser() user: any, @Param('id') id: string) {
    return this.supplierService.deleteOffer(user.id, id);
  }

  @Get('subscription/current')
  getCurrentSubscription(@CurrentUser() user: any) {
    return this.supplierService.getCurrentSubscription(user.id);
  }

  @Post('subscription/requests')
  @UseInterceptors(FileInterceptor('paymentProof'))
  createSubscriptionRequest(
    @CurrentUser() user: any,
    @Body('planId') planId: string,
    @UploadedFile() paymentProof?: Express.Multer.File,
  ) {
    return this.supplierService.createSubscriptionRequest(user.id, planId, paymentProof);
  }
}
