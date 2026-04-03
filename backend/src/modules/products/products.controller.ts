import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query('search') search?: string) {
    return this.productsService.getProducts(search);
  }
}
