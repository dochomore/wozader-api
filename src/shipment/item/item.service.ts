import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async getLocation(shipmentId: string, itemId: string, locationId: string) {
    throw new BadRequestException();
  }

  async findAllLocations(
    shipmentId: string,
    itemId: string,
  ): Promise<Location[]> {
    try {
      return await this.itemRepository
        .createQueryBuilder('item')
        .innerJoinAndSelect('item.locations', 'location')
        .select(['location'])
        .where('item.itemId =:id', { id: itemId })
        .getRawMany();
    } catch (error) {
      //return new BadRequestException();
    }
  }

  async create(shipmentId: string, createItemDto: CreateItemDto) {
    const { name, price, pricePerQt, amountInQt, location } = createItemDto;
    const item: Item = this.itemRepository.create({
      name: name,
      price: price,
      pricePerQt: pricePerQt,
      amountInQt: amountInQt,
      shipmentId: shipmentId,
      locations: location,
    });

    try {
      return await this.itemRepository.save(item);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findAll(shipmentId: string): Promise<Item[]> {
    try {
      return await this.itemRepository
        .createQueryBuilder('item')
        .where('item.shipmentId = :shipmentId', { shipmentId: shipmentId })
        .getMany();
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Item> {
    try {
      return await this.itemRepository.findOne({ where: { itemId: id } });
    } catch (err) {
      throw new BadRequestException();
    }
  }

  update(id: string, updateItemDto: UpdateItemDto) {
    const { name, pricePerQt, amountInQt, price } = updateItemDto;
    try {
      return this.itemRepository.update(id, {
        name: name,
        price: price,
        pricePerQt: pricePerQt,
        amountInQt: amountInQt,
      });
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      return await this.itemRepository.delete(id);
    } catch (err) {
      return new BadRequestException();
    }
  }
}
