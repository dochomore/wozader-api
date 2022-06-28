import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ShipmentStatus } from '../shipment-status.enums';
import { Item } from '../item/entities/item.entity';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  shipmentId: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @Column({ type: 'timestamptz' })
  updatedAt: Date = new Date();

  @Column()
  minLoadSize: number;

  @Column()
  maxLoadSize: number;

  @Column()
  vehicleModel: string;

  @Column()
  vehicleMaker: string;

  @Column()
  vehicleProductionYear: string;

  @Column()
  description: string;

  @Column()
  status: ShipmentStatus = ShipmentStatus.OPEN;

  @OneToMany(() => Item, (item) => item.shipmentId, {
    cascade: true,
  })
  items: Relation<Item[]>;
}
