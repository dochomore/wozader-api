import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentStatus } from './shipment-status.enums';
import { ShipmentService } from './shipment.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
});

describe('ShipmentService', () => {
  let service: ShipmentService;
  let repository: Repository<Shipment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipmentService,
        { provide: getRepositoryToken(Shipment), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ShipmentService>(ShipmentService);
    repository = module.get(getRepositoryToken(Shipment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new shipment', async () => {
      const shipment: Shipment = {
        shipmentId: '',
        createdAt: undefined,
        updatedAt: undefined,
        minLoadSize: 0,
        maxLoadSize: 0,
        vehicleModel: '',
        vehicleMaker: '',
        vehicleProductionYear: '',
        description: '',
        status: ShipmentStatus.OPEN,
        items: [],
      };

      const dto: any = {};

      const spy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => shipment);

      jest.spyOn(repository, 'save').mockResolvedValue(shipment);

      expect(service.create(dto)).resolves.toEqual(shipment);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw error', async () => {
      const shipment: Shipment = {
        shipmentId: '',
        createdAt: undefined,
        updatedAt: undefined,
        minLoadSize: 0,
        maxLoadSize: 0,
        vehicleModel: '',
        vehicleMaker: '',
        vehicleProductionYear: '',
        description: '',
        status: ShipmentStatus.OPEN,
        items: [],
      };

      const dto: any = {};

      const spy = jest
        .spyOn(repository, 'create')
        .mockImplementation(() => shipment);

      jest.spyOn(repository, 'save').mockRejectedValue(undefined);

      expect(service.create(dto)).resolves.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return shipment', async () => {
      const shipment: any = {};
      const id = 'id';

      const queryBuilder: any = {
        where: () => queryBuilder,
        leftJoinAndSelect: () => queryBuilder,
        select: () => queryBuilder,
        getOne: async () => shipment,
      };

      const queryBuilderSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockImplementation(() => queryBuilder);

      expect(service.findOne(id)).resolves.toEqual(shipment);
      expect(queryBuilderSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const id = 'id';

      const queryBuilder: any = {
        where: () => queryBuilder,
        leftJoinAndSelect: () => queryBuilder,
        select: () => queryBuilder,
        getOne: async () => undefined,
      };

      const spy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockImplementation(() => queryBuilder);

      expect(service.findOne(id)).resolves.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove shipment', async () => {
      const id = 'id';
      const deleteResult = { affected: 1 } as DeleteResult;

      const spy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(deleteResult);

      expect(service.remove(id)).resolves.toEqual(deleteResult);
      expect(spy).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException', async () => {
      const id = 'id';
      const deleteResult = { affected: 0 } as DeleteResult;

      const spy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(deleteResult);

      expect(service.remove(id)).resolves.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should udpate shipment', async () => {
      const id = 'id';
      const dto = {};
      const updateResult = { affected: 1 } as UpdateResult;
      const spy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(updateResult);

      expect(service.update(id, dto)).resolves.toEqual(updateResult);
      expect(spy).toHaveBeenCalledWith(id, dto);
    });
    it('should throw NotFoundException', async () => {
      const id = 'id';
      const dto = {};
      const updateResult = { affected: 0 } as UpdateResult;
      const spy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(updateResult);

      expect(service.update(id, dto)).resolves.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('findAll', () => {
    it('should return list of shipment', async () => {
      const result: any = [];

      const queryBuilder: any = {
        leftJoinAndSelect: () => queryBuilder,
        select: () => queryBuilder,
        getMany: async () => result,
      };

      const spy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockImplementation(() => queryBuilder);

      expect(service.findAll()).resolves.toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException', async () => {
      const queryBuilder: any = {
        leftJoinAndSelect: () => queryBuilder,
        select: () => queryBuilder,
        getMany: async () => undefined,
      };

      const spy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockImplementation(() => queryBuilder);

      expect(service.findAll()).resolves.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
