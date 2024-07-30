import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async checkInventory(productId: string) {
    return this.prisma.inventory.findFirst({
      where: {
        productId,
      },
    });
  }

  async updateInventory(productId: string, quantity: number) {
    return this.prisma.inventory.updateMany({
      where: { productId },
      data: { quantity },
    });
  }
}
