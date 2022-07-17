import { BadRequestException } from '@nestjs/common';
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
  });
});
