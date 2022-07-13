import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
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
});
