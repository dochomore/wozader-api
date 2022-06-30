import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { LocationModule } from 'src/location/location.module';
import { Location } from '../entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Location]), LocationModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
