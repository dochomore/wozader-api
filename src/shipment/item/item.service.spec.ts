import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Shipment),
          useValue: {},
        },
        { provide: getRepositoryToken(Item), useValue: { findOne: jest.fn } },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemRepository = module.get(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when item with id exists', () => {
      it('should return the item object', async () => {
        const itemId = '2de676c8-3440-4742-a349-929ab5e5757d';
        const expectedItem = {} as Item;

        const spy = jest
          .spyOn(itemRepository, 'findOne')
          .mockResolvedValue(expectedItem);

        expect(service.findOne(itemId)).resolves.toEqual(expectedItem);
        expect(spy).toBeCalledTimes(1);
      });
    });
    describe('otherwise', () => {
      it('should throw the NotFoundException', async () => {
        const itemId = '2de676c8-3440-4742-a349-929ab5e5757d';

        const spy = jest
          .spyOn(itemRepository, 'findOne')
          .mockRejectedValue(new NotFoundException());
        expect(service.findOne(itemId)).rejects.toBeInstanceOf(
          NotFoundException,
        );
        expect(spy).toBeCalledTimes(1);
      });
    });
  });
});
