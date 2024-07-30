import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Order } from '@prisma/client';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: Order) {
    try {
      const res = await this.orderService.createOrder(order);
      return {
        success: true,
        message: 'Order created successfully',
        data: res,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: true,
          message: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
