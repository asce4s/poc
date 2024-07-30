import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(orderId: string, userId: string, total: number) {
    const res = await this.prisma.payments.create({
      data: {
        orderId,
        paymentMethod: 'CREDIT_CARD',
        total,
        userId,
      },
    });

    return res;
  }
}
