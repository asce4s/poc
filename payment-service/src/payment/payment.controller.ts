import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'PAYMENT:CREATE' })
  async createPayment(data: {
    orderId: string;
    userId: string;
    total: number;
  }) {
    console.log(data);
    return await this.paymentService.createPayment(
      data.orderId,
      data.userId,
      data.total,
    );
  }
}
