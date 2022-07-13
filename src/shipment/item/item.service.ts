import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { Location } from '../../location/entities/location.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async getLocation(shipmentId: string, itemId: string, locationId: string) {
    try {
      const result = await this.itemRepository
        .createQueryBuilder('item')
        .innerJoinAndSelect('item.locations', 'location')
        .select(['location'])
        .where('item.itemId = :id', { id: itemId })
        .andWhere('location.locationId = :locationId', {
          locationId: locationId,
        })
        .getOne();
      if (!result) {
        throw new NotFoundException();
      }
    } catch (error) {
      return new NotFoundException();
    }
  }

  async findAllLocations(
    shipmentId: string,
    itemId: string,
  ): Promise<Location[] | BadRequestException> {
    try {
      const result = await this.itemRepository
        .createQueryBuilder('item')
        .innerJoinAndSelect('item.locations', 'location')
        .select(['location'])
        .where('item.itemId =:id', { id: itemId })
        .getRawMany();
      if (!result) {
        throw new NotFoundException();
      }
      return result;
    } catch (error) {
      return new NotFoundException();
    }
  }

  async create(shipmentId: string, createItemDto: CreateItemDto) {
    const {
      name,
      price,
      pricePerQt,
      amountInQt,
      startLocations: location,
    } = createItemDto;
    const item: Item = this.itemRepository.create({
      name: name,
      price: price,
      pricePerQt: pricePerQt,
      amountInQt: amountInQt,
      shipmentId: shipmentId,
      startLocations: location,
    });

    try {
      return await this.itemRepository.save(item);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findAll(shipmentId: string): Promise<Item[] | NotFoundException> {
    try {
      return await this.itemRepository
        .createQueryBuilder('item')
        .where('item.shipmentId = :shipmentId', { shipmentId: shipmentId })
        .getMany();
    } catch (err) {
      return new NotFoundException();
    }
  }

  async findOne(id: string): Promise<Item> {
    try {
      const result = await this.itemRepository.findOne({
        where: { itemId: id },
      });
      if (!result) {
        throw new NotFoundException();
      }
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  update(
    id: string,
    updateItemDto: UpdateItemDto,
  ): Promise<UpdateResult | BadRequestException | NotFoundException> {
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

  async remove(id: string): Promise<DeleteResult | NotFoundException> {
    try {
      return this.itemRepository.delete(id);
    } catch (err) {
      return new NotFoundException();
    }
  }
}
