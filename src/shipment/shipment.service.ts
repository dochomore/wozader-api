import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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

  async findOne(id: string): Promise<Shipment | BadRequestException> {
    try {
      const result = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.items', 'item')
        .select(['shipment', 'item.itemId', 'item.name', 'item.price'])
        .where('shipment.shipmentId =:shipmentId', { shipmentId: id })
        .getOne();

      if (!result) {
        throw new BadRequestException();
      }

      return result;
    } catch (error) {
      return new BadRequestException();
    }
  }

  update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const { description } = updateShipmentDto;
    return this.shipmentRepository.update(id, { description: description });
  }

  async remove(id: string): Promise<DeleteResult | NotFoundException> {
    try {
      const resutl = await this.shipmentRepository.delete(id);
      if (resutl.affected === 0) {
        throw new NotFoundException();
      }
      return resutl;
    } catch (error) {
      return new NotFoundException();
    }
  }
}
