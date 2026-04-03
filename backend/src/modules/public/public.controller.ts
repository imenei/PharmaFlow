import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('api/v1')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('public/suppliers/gold')
  getGoldSuppliers() {
    return this.publicService.getGoldSuppliers();
  }

  @Post('public/contact')
  createContact(@Body() body: { name: string; email: string; subject: string; message: string }) {
    return this.publicService.createContact(body);
  }

  @Get('catalog/suppliers')
  getSuppliers() {
    return this.publicService.getSuppliers();
  }

  @Get('catalog/offers')
  getOffers(@Query('search') search?: string) {
    return this.publicService.getOffers(search);
  }

  @Post('catalog/offers/track-view')
  trackOfferView(@Body('offerId') offerId: string) {
    return this.publicService.trackOfferView(offerId);
  }

  @Post('catalog/listings/search')
  searchListings(@Body('products') products: string[]) {
    return this.publicService.searchListings(products || []);
  }

  @Post('catalog/listings/:id/view')
  trackView(@Param('id') id: string) {
    return this.publicService.incrementListingMetric(id, 'views');
  }

  @Post('catalog/listings/:id/download')
  trackDownload(@Param('id') id: string) {
    return this.publicService.incrementListingMetric(id, 'downloads');
  }
}
