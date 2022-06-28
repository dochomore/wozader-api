import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @Column()
  locationName: string;

  @Column({ type: 'numeric' })
  latitude: number;

  @Column({ type: 'numeric' })
  longitude: number;
}
