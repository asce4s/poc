import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject('INVENTORY_SERVICE') private inventoryClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
  ) {}

  async createOrder(order: Order): Promise<Order> {
    const checkInventory$ = this.inventoryClient.send(
      { cmd: 'INVENTORY:CHECK' },
      { productId: order.productId },
    );

    const checkInventory = await firstValueFrom(checkInventory$);
    if (!checkInventory) {
      throw new Error('Product not found in inventory');
    }

    if (checkInventory.quantity < order.quantity) {
      throw new Error('Not enough inventory');
    }

    const updateInventory$ = this.inventoryClient.send(
      { cmd: 'INVENTORY:UPDATE' },
      {
        productId: order.productId,
        quantity: checkInventory.quantity - order.quantity,
      },
    );

    await firstValueFrom(updateInventory$);

    const res = await this.prisma.order.create({
      data: {
        productId: order.productId,
        quantity: order.quantity,
        status: 'SUCCESS',
      },
    });

    const createPayment$ = this.paymentClient.send(
      { cmd: 'PAYMENT:CREATE' },
      {
        orderId: res.id,
        userId: '1',
        total: order.quantity * 100,
      },
    );

    await firstValueFrom(createPayment$);

    return res;
  }
}
