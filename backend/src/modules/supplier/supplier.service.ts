import { BadRequestException, Injectable } from '@nestjs/common';
import pdf from 'pdf-parse';
import { PrismaService } from '../../prisma/prisma.service';
import { saveUploadedFile } from '../../common/files.util';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [listings, offers, payments] = await Promise.all([
      this.prisma.listing.findMany({ where: { supplierId: userId } }),
      this.prisma.offer.findMany({ where: { supplierId: userId } }),
      this.prisma.subscriptionPayment.findMany({
        where: { userId },
        include: { subscription: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalListings: listings.length,
      totalViews: listings.reduce((sum, item) => sum + item.views, 0),
      totalDownloads: listings.reduce((sum, item) => sum + item.downloads, 0),
      totalOffers: offers.length,
      currentSubscription: payments[0] || null,
      recentListings: listings.slice(0, 5),
    };
  }

  async getListings(userId: string) {
    return this.prisma.listing.findMany({
      where: { supplierId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createListing(userId: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('PDF file is required');
    const fileUrl = saveUploadedFile(file, 'listings');
    const parsed = await pdf(file.buffer);
    const lines = parsed.text
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 2)
      .slice(0, 250);

    const listing = await this.prisma.listing.create({
      data: {
        supplierId: userId,
        title: file.originalname.replace(/\.pdf$/i, ''),
        description: `Catalogue avec ${lines.length} produits`,
        fileUrl,
        extractedText: parsed.text,
        products: {
          create: lines.map((line) => ({
            productName: line,
            quantity: 1,
            price: 0,
          })),
        },
      },
    });

    return {
      ...listing,
      file_url: listing.fileUrl,
      extracted_text: listing.extractedText,
      created_at: listing.createdAt,
    };
  }

  async deleteListing(userId: string, id: string) {
    const listing = await this.prisma.listing.findFirst({ where: { id, supplierId: userId } });
    if (!listing) throw new BadRequestException('Listing not found');
    await this.prisma.listing.delete({
      where: { id },
    });
    return { success: true };
  }

  async getOffers(userId: string) {
    return this.prisma.offer.findMany({
      where: { supplierId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveOffer(userId: string, body: Record<string, string>, image?: Express.Multer.File, id?: string) {
    let imageUrl = body.image_url || null;
    if (image) {
      imageUrl = saveUploadedFile(image, 'offers');
    }

    if (id) {
      const existing = await this.prisma.offer.findFirst({ where: { id, supplierId: userId } });
      if (!existing) throw new BadRequestException('Offer not found');
      return this.prisma.offer.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          expiresAt: new Date(body.expires_at),
          imageUrl,
        },
      });
    }

    return this.prisma.offer.create({
      data: {
        supplierId: userId,
        title: body.title,
        description: body.description,
        expiresAt: new Date(body.expires_at),
        imageUrl,
      },
    });
  }

  async deleteOffer(userId: string, id: string) {
    const offer = await this.prisma.offer.findFirst({ where: { id, supplierId: userId } });
    if (!offer) throw new BadRequestException('Offer not found');
    await this.prisma.offer.delete({ where: { id } });
    return { success: true };
  }

  async getCurrentSubscription(userId: string) {
    return this.prisma.subscriptionPayment.findFirst({
      where: { userId, status: 'APPROVED' },
      include: { subscription: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSubscriptionRequest(userId: string, planId: string, paymentProof?: Express.Multer.File) {
    if (!paymentProof) throw new BadRequestException('Payment proof is required');
    const proofUrl = saveUploadedFile(paymentProof, 'payment-proofs');
    return this.prisma.subscriptionPayment.create({
      data: {
        userId,
        subscriptionId: planId,
        proofUrl,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user ? this.sanitize(user) : null;
  }

  async updateProfile(userId: string, body: Record<string, string>, avatar?: Express.Multer.File) {
    const avatarUrl = avatar ? saveUploadedFile(avatar, 'avatars') : body.avatarUrl || undefined;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        companyName: body.companyName,
        phone: body.phone,
        wilaya: body.wilaya,
        address: body.address,
        description: body.description,
        avatarUrl,
      },
    });
    return this.sanitize(user);
  }

  private sanitize(user: any) {
    const { passwordHash, ...safe } = user;
    return {
      ...safe,
      role: safe.role.toLowerCase(),
      status: safe.status.toLowerCase(),
      company_name: safe.companyName,
      avatar_url: safe.avatarUrl,
      created_at: safe.createdAt,
    };
  }
}
