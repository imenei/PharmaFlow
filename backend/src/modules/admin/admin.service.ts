import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany({
      where: { NOT: { role: 'ADMIN' } },
      orderBy: { createdAt: 'desc' },
    });
    return {
      users: users.map((user) => this.sanitize(user)),
    };
  }

  async getPayments() {
    const payments = await this.prisma.subscriptionPayment.findMany({
      include: { user: true, subscription: true },
      orderBy: { createdAt: 'desc' },
    });
    return payments.map((payment) => ({
      id: payment.id,
      subscription_id: payment.subscriptionId,
      user_id: payment.userId,
      proof_url: payment.proofUrl,
      status: payment.status.toLowerCase(),
      created_at: payment.createdAt,
      subscription_start: payment.subscriptionStart,
      subscription_end: payment.subscriptionEnd,
      is_active: payment.isActive,
      profile: {
        company_name: payment.user.companyName,
        email: payment.user.email,
      },
      subscription: {
        id: payment.subscription.id,
        name: payment.subscription.name,
        price: payment.subscription.price,
        duration_days: payment.subscription.durationDays,
        features: payment.subscription.features,
      },
    }));
  }

  getMessages() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getSubscriptions() {
    const subscriptions = await this.prisma.subscriptionPlan.findMany({ orderBy: { price: 'asc' } });
    return { subscriptions };
  }

  async approveSubscription(paymentId: string) {
    const payment = await this.prisma.subscriptionPayment.findUnique({
      where: { id: paymentId },
      include: { subscription: true },
    });
    if (!payment) return { success: false };
    const start = new Date();
    const end = new Date(start.getTime() + payment.subscription.durationDays * 24 * 60 * 60 * 1000);
    await this.prisma.subscriptionPayment.update({
      where: { id: paymentId },
      data: {
        status: 'APPROVED',
        isActive: true,
        subscriptionStart: start,
        subscriptionEnd: end,
      },
    });
    return { success: true };
  }

  async rejectSubscription(paymentId: string) {
    await this.prisma.subscriptionPayment.update({
      where: { id: paymentId },
      data: { status: 'REJECTED', isActive: false },
    });
    return { success: true };
  }

  async updateUserStatus(userId: string, status: 'approved' | 'rejected') {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: status.toUpperCase() as any },
    });
    return { success: true };
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true };
  }

  async markMessageAsRead(messageId: string) {
    await this.prisma.contactMessage.update({
      where: { id: messageId },
      data: { status: 'READ' as any },
    });
    return { success: true };
  }

  async deleteMessage(messageId: string) {
    await this.prisma.contactMessage.delete({ where: { id: messageId } });
    return { success: true };
  }

  async checkSubscriptions() {
    const result = await this.prisma.subscriptionPayment.updateMany({
      where: {
        isActive: true,
        subscriptionEnd: { lt: new Date() },
      },
      data: { isActive: false },
    });
    return { success: true, expiredCount: result.count };
  }

  private sanitize(user: any) {
    const { passwordHash, ...safe } = user;
    return {
      ...safe,
      role: safe.role.toLowerCase(),
      status: safe.status.toLowerCase(),
      company_name: safe.companyName,
      created_at: safe.createdAt,
    };
  }
}
