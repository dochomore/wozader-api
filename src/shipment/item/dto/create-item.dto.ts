import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  amountInQt: number;

  @IsNumber()
  @Min(0)
  pricePerQt: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDefined()
  @IsArray({ message: 'Location should be array of locations' })
  @ValidateNested({ each: true })
  @Type(() => CreateLocationDto)
  location: CreateLocationDto[];
}
