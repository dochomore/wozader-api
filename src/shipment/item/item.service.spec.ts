import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('ItemService', () => {
  let service: ItemService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Shipment),
          useValue: createMockRepository(),
        },
        { provide: getRepositoryToken(Item), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when item with id exists', () => {
      it('should return the coffee object', async () => {
        const itemId = '2de676c8-3440-4742-a349-929ab5e5757d';
        const expectedItem = {};

        coffeeRepository.findOne.mockReturnValue(expectedItem);
        const item = await service.findOne(itemId);
        console.log(item);
        expect(item).toEqual(expectedItem);
      });
    });
    describe('otherwise', () => {
      it('should throw the NotFoundException', async () => {
        const itemId = '2de676c8-3440-4742-a349-929ab5e5757d';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(itemId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
