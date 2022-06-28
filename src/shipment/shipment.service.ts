import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { ShipmentStatus } from './shipment-status.enums';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
  ) {}

  // creates new shipment
  create(createShipmentDto: CreateShipmentDto) {
    const {
      description,
      maxLoadSize,
      minLoadSize,
      vehicleModel,
      vehicleMaker,
      vehicleProductionYear,
      items,
    } = createShipmentDto;

    const shipment = this.shipmentRepository.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      description: description,
      maxLoadSize: maxLoadSize,
      minLoadSize: minLoadSize,
      vehicleModel: vehicleModel,
      vehicleMaker: vehicleMaker,
      vehicleProductionYear: vehicleProductionYear,
      status: ShipmentStatus.OPEN,
      items: items,
    });

    try {
      return this.shipmentRepository.save(shipment);
    } catch (err) {
      throw new ForbiddenException(
        'there is somehting error with your entries',
      );
    }
  }

  findAll(): Promise<Shipment[]> {
    // return this.shipmentRepository.find();
    return this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.items', 'item')
      .select(['shipment', 'item.itemId', 'item.name', 'item.price'])
      .getMany();
  }

  findOne(id: string): Promise<Shipment> {
    return this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.items', 'item')
      .select(['shipment', 'item.itemId', 'item.name', 'item.price'])
      .where('shipment.shipmentId =:shipmentId', { shipmentId: id })
      .getOne();
  }

  update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const { description } = updateShipmentDto;
    return this.shipmentRepository.update(id, { description: description });
  }

  async remove(id: string): Promise<void> {
    await this.shipmentRepository.delete(id);
  }
}
