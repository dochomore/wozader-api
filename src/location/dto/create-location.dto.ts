import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  locationName: string;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;
}
