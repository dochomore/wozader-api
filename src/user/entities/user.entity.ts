import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Wozader User
 */

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  fatherName: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  refreshToken: string;
}
