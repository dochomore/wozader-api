import { BadRequestException, Injectable } from '@nestjs/common';
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
  async create(createShipmentDto: CreateShipmentDto) {
    const {
      description,
      maxLoadSize,
      minLoadSize,
      vehicleModel,
      vehicleMaker,
      vehicleProductionYear,
      items,
    } = createShipmentDto;
    try {
      const shipment = await this.shipmentRepository.create({
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

      const result = await this.shipmentRepository.save(shipment);
      if (!result) {
        throw new BadRequestException();
      }
      return result;
    } catch (err) {
      return new BadRequestException();
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
