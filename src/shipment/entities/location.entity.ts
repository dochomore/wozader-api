import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @Column()
  name: string;

  @Column()
  lat: number;

  @Column()
  lng: number;
}
