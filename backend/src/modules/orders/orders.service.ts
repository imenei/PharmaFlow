import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  getOrders(user: { id: string; role: string }) {
    return this.prisma.order.findMany({
      where:
        user.role === 'SUPPLIER'
          ? { supplierId: user.id }
          : user.role === 'PHARMACIST'
            ? { pharmacistId: user.id }
            : undefined,
      include: {
        supplier: { select: { id: true, companyName: true } },
        pharmacist: { select: { id: true, companyName: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  createOrder(pharmacistId: string, body: { supplierId: string; listingId?: string; notes?: string; totalItems?: number }) {
    return this.prisma.order.create({
      data: {
        pharmacistId,
        supplierId: body.supplierId,
        listingId: body.listingId,
        notes: body.notes,
        totalItems: body.totalItems ?? 0,
        status: 'SUBMITTED',
      },
    });
  }
}
