import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Item } from './shipment/item/entities/item.entity';
import { Shipment } from './shipment/entities/shipment.entity';
import { ShipmentModule } from './shipment/shipment.module';
import { LocationModule } from './location/location.module';
import { Location } from './location/entities/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [Shipment, Item, Location],
      synchronize: true, // do not do this on production
    }),
    ShipmentModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
