import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
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

  @IsNotEmpty({ message: 'Item Location Required' })
  location: Array<CreateLocationDto>;
}
