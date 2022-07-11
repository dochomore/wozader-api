import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { Item } from './entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        { provide: getRepositoryToken(Item), useValue: {} },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of item', async () => {
      const result = [];
      const spy = jest.spyOn(service, 'findAll').mockResolvedValue(result);
      const id = '1';

      expect(await controller.findAll(id)).toBe(result);
      expect(spy).toBeCalledWith(id);
    });

    it("should throw 'BadRequestException' if invalid id is provided", async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new BadRequestException());

      const id = 'id';

      expect(controller.findAll(id)).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single Item', () => {
      const item: Item = {
        itemId: '',
        createdAt: undefined,
        updatedAt: '',
        name: '',
        amountInQt: 0,
        pricePerQt: 0,
        price: 0,
        shipmentId: '',
        startLocations: [],
        endLocations: [],
      };
      const spy = jest.spyOn(service, 'findOne').mockResolvedValue(item);

      expect(controller.findOne('id')).resolves.toBe(item);
      expect(spy).toHaveBeenCalledWith('id');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw 'NotFoundException' for invalid id", () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException());

      expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('1');
    });
  });

  describe('delete', () => {
    it('should delete item with valid id', async () => {
      const result: DeleteResult = {
        raw: undefined,
      };
      const spy = jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect(controller.remove('id')).resolves.toBe(result);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('id');
    });
  });
});
