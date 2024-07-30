import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Inventory } from '@prisma/client';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern({ cmd: 'INVENTORY:UPDATE' })
  async updateInventory(data: Inventory) {
    console.log(data);
    return await this.inventoryService.updateInventory(
      data.productId,
      data.quantity,
    );
  }

  @MessagePattern({ cmd: 'INVENTORY:CHECK' })
  async checkInventory(data: { productId: string }) {
    return this.inventoryService.checkInventory(data.productId);
  }
}
