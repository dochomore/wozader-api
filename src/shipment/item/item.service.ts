import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemWithLocation } from './entities/item-with-location.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemWithLocation)
    private readonly itemWithLocationRepository: Repository<ItemWithLocation>,
  ) {}

  async create(shipmentId: string, createItemDto: CreateItemDto) {
    const { name, price, pricePerQt, amountInQt, location } = createItemDto;
    const item: Item = this.itemRepository.create({
      name: name,
      price: price,
      pricePerQt: pricePerQt,
      amountInQt: amountInQt,
      shipmentId: shipmentId,
    });

    try {
      const savedItem = await this.itemRepository.save(item);
      if (savedItem) {
        /**
         * save each location to location table
         * then add location.id with item.id inside LocationWithItemEntity
         */
      }
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
