import { Item } from '../item/entities/item.entity';

export class CreateShipmentDto {
  description: string;
  minLoadSize: number;
  maxLoadSize: number;
  vehicleModel: string;
  vehicleMaker: string;
  vehicleProductionYear: string;
  items: Item[];
}
