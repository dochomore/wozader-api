import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
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
    @Param('shipmentId', new ParseUUIDPipe()) shipmentId: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemService.create(shipmentId, createItemDto);
  }

  @Get()
  findAll(
    @Param('shipmentId', new ParseUUIDPipe()) shipmentId: string,
  ): Promise<Item[]> {
    return this.itemService.findAll(shipmentId);
  }

  @Get('/:itemId/locations')
  findAllLocations(
    @Param('shipmentId', new ParseUUIDPipe()) shipmentId: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
  ) {
    return this.itemService.findAllLocations(shipmentId, itemId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemService.remove(id);
  }
}
