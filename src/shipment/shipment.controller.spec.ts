import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';

const mockService = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('ShipmentController', () => {
  let controller: ShipmentController;
  let service: ShipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentController],
      providers: [
        ShipmentService,
        { provide: getRepositoryToken(Shipment), useFactory: mockService },
      ],
    }).compile();

    controller = module.get(ShipmentController);
    service = module.get(ShipmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create new shipment', async () => {
      const member: any = {};
      const dto: any = {};
      const spy = jest.spyOn(service, 'create').mockResolvedValue(member);

      expect(controller.create(dto)).resolves.toEqual(member);
      expect(spy).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException', async () => {
      const dto: any = {};
      const spy = jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      expect(controller.create(dto)).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update shipment', async () => {
      const id = 'id';
      const updateDto: any = {};

      const spy = jest.spyOn(service, 'update').mockResolvedValue(updateDto);

      expect(controller.update(id, updateDto)).resolves.toEqual(updateDto);
      expect(spy).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw NotFoundException', async () => {
      const id = 'id';
      const updateDto: any = {};

      const spy = jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException());

      expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('findAll', () => {
    it('should return shipments', async () => {
      const result = [];
      const spy = jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(controller.findAll()).resolves.toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new BadRequestException());
      expect(controller.findAll()).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return shipment', async () => {
      const member: any = {};
      const id = 'id';
      const spy = jest.spyOn(service, 'findOne').mockResolvedValue(member);
      expect(service.findOne(id)).resolves.toEqual(member);
      expect(spy).toHaveBeenCalledWith(id);
    });
  });
});
