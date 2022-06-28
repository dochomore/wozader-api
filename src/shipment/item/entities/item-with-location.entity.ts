import { Location } from 'src/location/entities/location.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class ItemWithLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Item, (item) => item.itemId, { cascade: true })
  itemId: Relation<Item>;

  @ManyToOne(() => Location, (location) => location.locationId)
  locationId: Relation<Location>;
}
