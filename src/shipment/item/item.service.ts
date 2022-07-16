import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Location } from '../../location/entities/location.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

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
  ): Promise<Location[] | NotFoundException> {
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

  async create(
    shipmentId: string,
    createItemDto: CreateItemDto,
  ): Promise<Item | NotFoundException | BadRequestException> {
    const {
      name,
      price,
      pricePerQt,
      amountInQt,
      startLocations,
      endLocations,
    } = createItemDto;

    try {
      const item = this.itemRepository.create({
        name: name,
        price: price,
        pricePerQt: pricePerQt,
        amountInQt: amountInQt,
        shipmentId: shipmentId,
        startLocations: startLocations,
        endLocations: endLocations,
      });

      return this.itemRepository.save(item);
    } catch (err) {
      if (err instanceof BadRequestException) {
        return new BadRequestException();
      }
      return new NotFoundException();
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

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
  ): Promise<UpdateResult | NotFoundException> {
    const { name, pricePerQt, amountInQt, price } = updateItemDto;
    try {
      const result: UpdateResult = await this.itemRepository.update(id, {
        name: name,
        price: price,
        pricePerQt: pricePerQt,
        amountInQt: amountInQt,
      });
      if (result.affected === 0) {
        throw new NotFoundException();
      }
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async remove(id: string): Promise<DeleteResult | NotFoundException> {
    try {
      const result: DeleteResult = await this.itemRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException();
      }
      return result;
    } catch (err) {
      return new NotFoundException();
    }
  }
}
