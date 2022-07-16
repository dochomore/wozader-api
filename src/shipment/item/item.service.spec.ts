import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
  where: jest.fn(),
});

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useFactory: mockRepository,
        },
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

  describe('remove', () => {
    it('should remove item ', async () => {
      const id = '';
      const expectedResult = { affected: 1 } as DeleteResult;
      const removeSpy = jest
        .spyOn(itemRepository, 'delete')
        .mockResolvedValue(expectedResult);

      expect(service.remove(id)).resolves.toEqual(expectedResult);
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith(id);
    });

    it("should throw 'NotFoundException' for invalid id", async () => {
      const removeSpy = jest
        .spyOn(itemRepository, 'delete')
        .mockRejectedValue(new NotFoundException());

      expect(service.remove('id')).rejects.toThrow(NotFoundException);

      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith('id');
    });
  });

  describe('find all items', () => {
    it('should return list of item', async () => {
      const shipmentId = 'f1409812-38aa-40e0-9107-2f0e6a7b2239';
      const result = [];

      const createQueryBuilder: any = {
        where: () => createQueryBuilder,
        getMany: () => [],
      };

      const findSpy = jest
        .spyOn(itemRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      expect(service.findAll(shipmentId)).resolves.toEqual(result);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('shoud throw [NotFoundException] for invalid id', async () => {
      const shipmentId = 'invalidShipmentId';

      const createQueryBuilder: any = {
        where: () => createQueryBuilder,
        getMany: () => new NotFoundException(),
      };

      const findSpy = jest
        .spyOn(itemRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      expect(service.findAll(shipmentId)).resolves.toThrow(NotFoundException);
      expect(findSpy).toHaveBeenCalled();
      expect(findSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update item ', async () => {
      const id = 'f1409812-38aa-40e0-9107-2f0e6a7b2239';
      const dto = { name: 'yimesgen' };
      const expectedResult = { affected: 1 } as UpdateResult;

      const updateSpy = jest
        .spyOn(itemRepository, 'update')
        .mockResolvedValue(expectedResult);

      expect(service.update(id, dto)).resolves.toEqual(expectedResult);
      expect(updateSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith(id, dto);
    });

    it('should throw [NotFoundException] for invalid id', async () => {
      const id = 'invalidId';
      const dto = { name: 'yimesgen' };

      const updateSpy = jest
        .spyOn(itemRepository, 'update')
        .mockRejectedValue(new NotFoundException());

      expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
      expect(updateSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('create', () => {
    it('should create new item', async () => {
      const id = 'f1409812-38aa-40e0-9107-2f0e6a7b2239';
      const dto: CreateItemDto = {
        name: 'name',
        amountInQt: 0,
        pricePerQt: 0,
        price: 0,
        startLocations: [],
        endLocations: [],
      };

      const result: Item = {
        name: 'Yimesge',
        amountInQt: 23,
        pricePerQt: 130,
        startLocations: [],
        endLocations: [],
        itemId: '',
        createdAt: undefined,
        updatedAt: '',
        price: 0,
        shipmentId: '',
      };

      const createSpy = jest
        .spyOn(itemRepository, 'create')
        .mockImplementation(() => result);

      const saveSpy = jest
        .spyOn(itemRepository, 'save')
        .mockResolvedValueOnce(result);

      expect(service.create(id, dto)).resolves.toEqual(result);

      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should throw [BadRequestException] for empty start location', async () => {
      const id = 'f1409812-38aa-40e0-9107-2f0e6a7b2239';

      const dto: any = {
        name: 'Yimesgen',
        price: 12000,
        pricePerQt: 180,
        amountInQt: 300, // no start location here
        endLocations: [],
      };

      const result: Item = {
        name: 'Yimesge',
        amountInQt: 23,
        pricePerQt: 130,
        startLocations: [],
        endLocations: [],
        itemId: '',
        createdAt: undefined,
        updatedAt: '',
        price: 0,
        shipmentId: '',
      };

      const createSpy = jest
        .spyOn(itemRepository, 'create')
        .mockImplementation(() => result);

      const saveSpy = jest
        .spyOn(itemRepository, 'save')
        .mockResolvedValue(result);

      expect(service.create(id, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(createSpy).toHaveBeenCalledTimes(0);
      expect(saveSpy).toHaveBeenCalledTimes(0);
    });

    it('should throw [NotFoundException] for invaid id', async () => {
      const id = 'invalidId';
      const dto: CreateItemDto = {
        name: 'Yimesgen',
        price: 12000,
        pricePerQt: 180,
        amountInQt: 300,
        startLocations: [],
        endLocations: [],
      };

      const result: Item = {
        name: 'Yimesge',
        amountInQt: 23,
        pricePerQt: 130,
        startLocations: [],
        endLocations: [],
        itemId: '',
        createdAt: undefined,
        updatedAt: '',
        price: 0,
        shipmentId: '',
      };

      const createSpy = jest
        .spyOn(itemRepository, 'create')
        .mockImplementation(() => result);

      const saveSpy = jest
        .spyOn(itemRepository, 'save')
        .mockRejectedValue(new NotFoundException());

      expect(service.create(id, dto)).rejects.toThrow(BadRequestException);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
