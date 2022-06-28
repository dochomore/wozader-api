import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { ItemModule } from './item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment]), ItemModule],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule {}
