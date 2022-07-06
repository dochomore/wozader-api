import { Location } from '../../../location/entities/location.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shipment } from '../../entities/shipment.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column({ type: 'timestamptz', default: new Date() })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: new Date() })
  updatedAt: string;

  @Column()
  name: string;

  // NB Qt stands for Quinetal
  @Column()
  amountInQt: number;

  // NB Qt stands for Quinetal
  @Column()
  pricePerQt: number;

  // amountInQt * pricePerQt
  @Column()
  price: number;

  @ManyToOne(() => Shipment, (shipment) => shipment.items, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  shipmentId: string;

  @ManyToMany(() => Location, { cascade: true })
  @JoinTable({
    name: 'item_with_location',
    joinColumn: { name: 'item', referencedColumnName: 'itemId' },
    inverseJoinColumn: { name: 'location', referencedColumnName: 'locationId' },
  })
  startLocations: Location[];

  @ManyToMany(() => Location, { cascade: true })
  @JoinTable({
    name: 'item_with_location',
    joinColumn: { name: 'item', referencedColumnName: 'itemId' },
    inverseJoinColumn: { name: 'location', referencedColumnName: 'locationId' },
  })
  endLocations: Location[];
}
