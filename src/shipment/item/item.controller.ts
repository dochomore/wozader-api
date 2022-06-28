import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Controller('shipments/:shipmentId/items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(
    @Param('shipmentId') shipmentId: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemService.create(shipmentId, createItemDto);
  }

  @Get()
  findAll(@Param('shipmentId') shipmentId: string): Promise<Item[]> {
    return this.itemService.findAll(shipmentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }
}
