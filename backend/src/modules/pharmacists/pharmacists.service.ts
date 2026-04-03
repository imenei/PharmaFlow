import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PharmacistsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [notifications, offers, suppliers] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.offer.count({
        where: {
          expiresAt: { gt: new Date() },
          supplier: { role: 'SUPPLIER', status: 'APPROVED' },
        },
      }),
      this.prisma.user.count({
        where: { role: 'SUPPLIER', status: 'APPROVED' },
      }),
    ]);

    return {
      totalSuppliers: suppliers,
      activeOffers: offers,
      unreadNotifications: notifications.filter((item) => !item.isRead).length,
      recentNotifications: notifications,
    };
  }

  async getSuppliers(filters: { search?: string; wilaya?: string }) {
    const suppliers = await this.prisma.user.findMany({
      where: {
        role: 'SUPPLIER',
        status: 'APPROVED',
        ...(filters.search
          ? {
              OR: [
                { companyName: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(filters.wilaya ? { wilaya: filters.wilaya } : {}),
      },
      include: {
        listings: true,
        offers: { where: { expiresAt: { gt: new Date() } } },
        ratingsReceived: true,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      suppliers: suppliers.map((supplier) => {
        const avgRating =
          supplier.ratingsReceived.length === 0
            ? 0
            : supplier.ratingsReceived.reduce((sum, item) => sum + item.score, 0) / supplier.ratingsReceived.length;

        return {
          id: supplier.id,
          companyName: supplier.companyName,
          wilaya: supplier.wilaya,
          phone: supplier.phone,
          email: supplier.email,
          description: supplier.description,
          avatarUrl: supplier.avatarUrl,
          listingsCount: supplier.listings.length,
          activeOffers: supplier.offers.length,
          rating: avgRating,
          reviewsCount: supplier.ratingsReceived.length,
          totalViews: supplier.listings.reduce((sum, item) => sum + item.views, 0),
          totalDownloads: supplier.listings.reduce((sum, item) => sum + item.downloads, 0),
        };
      }),
    };
  }

  async getSupplierById(id: string, viewerUserId: string) {
    const supplier = await this.prisma.user.findFirst({
      where: { id, role: 'SUPPLIER' },
      include: {
        listings: { include: { products: true }, orderBy: { createdAt: 'desc' } },
        offers: { where: { expiresAt: { gt: new Date() } }, orderBy: { createdAt: 'desc' } },
        ratingsReceived: {
          include: {
            pharmacist: { select: { id: true, companyName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    await this.prisma.supplierProfileView.create({
      data: {
        supplierId: supplier.id,
        viewerUserId,
      },
    });

    return supplier;
  }

  async getOffers(search?: string) {
    return this.prisma.offer.findMany({
      where: {
        expiresAt: { gt: new Date() },
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        supplier: {
          select: { id: true, companyName: true, avatarUrl: true, wilaya: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async rateSupplier(pharmacistId: string, body: { supplierId: string; score: number; comment?: string }) {
    return this.prisma.rating.upsert({
      where: {
        supplierId_pharmacistId: {
          supplierId: body.supplierId,
          pharmacistId,
        },
      },
      update: {
        score: body.score,
        comment: body.comment,
      },
      create: {
        supplierId: body.supplierId,
        pharmacistId,
        score: body.score,
        comment: body.comment,
      },
    });
  }
}
