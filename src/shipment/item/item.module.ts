import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemWithLocation } from './entities/item-with-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemWithLocation])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
