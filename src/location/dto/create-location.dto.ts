import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  locationName: string;

  @IsLongitude({ message: 'Not a valid latitude' })
  longitude: number;

  @IsLatitude({ message: 'Not a valid longitude' })
  latitude: number;
}
