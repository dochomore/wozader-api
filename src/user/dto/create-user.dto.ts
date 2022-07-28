import { IsDefined } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  username: string;

  @IsDefined()
  firstName: string;

  @IsDefined()
  fatherName: string;

  @IsDefined()
  createdAt: string;

  @IsDefined()
  updatedAt: string;

  @IsDefined()
  password: string;

  imageUrl?: string;
}
