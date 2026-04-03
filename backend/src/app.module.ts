import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PublicModule } from './modules/public/public.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { PharmacistsModule } from './modules/pharmacists/pharmacists.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PublicModule,
    NotificationsModule,
    AdminModule,
    SupplierModule,
    PharmacistsModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
