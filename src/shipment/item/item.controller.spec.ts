import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
  });
});
