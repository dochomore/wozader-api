import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('LocationService', () => {
  let service: LocationService;
  let repository: Repository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: getRepositoryToken(Location), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get(getRepositoryToken(Location));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new location', async () => {
      const location: any = {};
      const dto: any = {};

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => location);
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(location);

      expect(service.create(dto)).resolves.toEqual(location);
      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(saveSpy).toHaveBeenCalledWith(location);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException', async () => {
      const location: any = {};
      const dto: any = {};

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => location);

      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockRejectedValue(undefined);

      expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return list of location', async () => {
      const result = [];
      const spy = jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(service.findAll()).resolves.toEqual(result);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException', async () => {
      const spy = jest.spyOn(repository, 'find').mockResolvedValue(undefined);

      expect(service.findAll()).resolves.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return location', async () => {
      const location: any = {};
      const id = 'id';
      const spy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValue(location);

      expect(service.findOne(id)).resolves.toEqual(location);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const id = 'id';
      const spy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValue(undefined);

      expect(service.findOne(id)).resolves.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update location', async () => {
      const updateResult = { affected: 1 } as UpdateResult;
      const id = 'id';
      const dto = {};

      const spy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(updateResult);

      expect(service.update(id, dto)).resolves.toEqual(updateResult);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const updateResult = { affected: 0 } as UpdateResult;
      const id = 'id';
      const dto = {};

      const spy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(updateResult);

      expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove location', async () => {
      const removeResult = { affected: 1 } as DeleteResult;
      const id = 'id';

      const spy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(removeResult);

      expect(service.remove(id)).resolves.toEqual(removeResult);
      expect(spy).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException', async () => {
      const removeResult = { affected: 0 } as DeleteResult;
      const id = 'id';

      const spy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(removeResult);

      expect(service.remove(id)).resolves.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledWith(id);
    });
  });
});
