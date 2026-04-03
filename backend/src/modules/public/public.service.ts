import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  createContact(payload: { name: string; email: string; subject: string; message: string }) {
    return this.prisma.contactMessage.create({ data: payload });
  }

  async getGoldSuppliers() {
    const suppliers = await this.prisma.user.findMany({
      where: {
        role: 'SUPPLIER',
        status: 'APPROVED',
      },
      select: {
        id: true,
        companyName: true,
        wilaya: true,
        description: true,
        avatarUrl: true,
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    return suppliers.map((item) => ({
      id: item.id,
      company_name: item.companyName,
      wilaya: item.wilaya,
      description: item.description,
      avatar_url: item.avatarUrl,
    }));
  }

  async getSuppliers() {
    const [wilayas, suppliers] = await Promise.all([
      this.prisma.wilaya.findMany({ orderBy: { nom: 'asc' } }),
      this.prisma.user.findMany({
        where: { role: 'SUPPLIER', status: 'APPROVED' },
        include: {
          listings: true,
          offers: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      wilayas,
      suppliers: suppliers.map((supplier) => ({
        id: supplier.id,
        name: supplier.companyName || 'Fournisseur',
        address: supplier.address || 'Adresse non specifiee',
        wilaya: supplier.wilaya || 'Non specifiee',
        contact_email: supplier.email,
        contact_phone: supplier.phone,
        description: supplier.description,
        logo_url: supplier.avatarUrl,
        subscription_tier: 'basic',
        rating: 4.5,
        reviews_count: 0,
        total_views: supplier.listings.reduce((sum, listing) => sum + listing.views, 0),
        total_downloads: supplier.listings.reduce((sum, listing) => sum + listing.downloads, 0),
        listings_count: supplier.listings.length,
        active_offers: supplier.offers.length,
        has_active_subscription: true,
        created_at: supplier.createdAt,
      })),
    };
  }

  async getOffers(search?: string) {
    const offers = await this.prisma.offer.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        supplier: {
          role: 'SUPPLIER',
          status: 'APPROVED',
        },
      },
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    });

    return offers
      .map((offer) => ({
        id: offer.id,
        title: offer.title,
        supplier_name: offer.supplier.companyName || 'Fournisseur',
        supplier_id: offer.supplierId,
        description: offer.description,
        image_url: offer.imageUrl,
        views: offer.views,
        created_at: offer.createdAt,
        expires_at: offer.expiresAt,
        is_expired: offer.expiresAt.getTime() < Date.now(),
        pdf_url: offer.imageUrl,
        supplier_info: {
          email: offer.supplier.email,
          phone: offer.supplier.phone,
          wilaya: offer.supplier.wilaya,
          avatar_url: offer.supplier.avatarUrl,
        },
      }))
      .filter((offer) => !offer.is_expired);
  }

  async trackOfferView(offerId: string) {
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { views: { increment: 1 } },
    });
    return { success: true };
  }

  async searchListings(products: string[]) {
    const terms = products.filter(Boolean);
    const matches = await this.prisma.listingProduct.findMany({
      where: {
        OR: terms.map((term) => ({
          productName: { contains: term, mode: 'insensitive' },
        })),
        listing: {
          supplier: {
            role: 'SUPPLIER',
            status: 'APPROVED',
          },
        },
      },
      include: {
        listing: {
          include: {
            supplier: true,
            products: true,
          },
        },
      },
      take: 100,
    });

    const grouped = new Map<string, any>();
    for (const item of matches) {
      const listing = item.listing;
      if (!grouped.has(listing.id)) {
        grouped.set(listing.id, {
          id: listing.id,
          title: listing.title,
          pdf_url: listing.fileUrl,
          views: listing.views,
          downloads: listing.downloads,
          created_at: listing.createdAt,
          supplier: {
            id: listing.supplier.id,
            name: listing.supplier.companyName,
            tier: 'standard',
            wilaya: listing.supplier.wilaya,
            logo_url: listing.supplier.avatarUrl,
            contact_phone: listing.supplier.phone,
            contact_email: listing.supplier.email,
          },
          products: [],
          total_products: listing.products.length,
          matching_products_count: 0,
        });
      }
      const current = grouped.get(listing.id);
      current.products.push({
        product_name: item.productName,
        price: item.price,
        quantity: item.quantity,
      });
      current.matching_products_count = current.products.length;
    }

    return { listings: Array.from(grouped.values()) };
  }

  async incrementListingMetric(id: string, metric: 'views' | 'downloads') {
    await this.prisma.listing.update({
      where: { id },
      data: { [metric]: { increment: 1 } },
    });
    return { success: true };
  }
}
