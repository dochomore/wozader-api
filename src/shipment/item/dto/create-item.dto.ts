import { IsNumber, IsString, Min } from 'class-validator';

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
}
