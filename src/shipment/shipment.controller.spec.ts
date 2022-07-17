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
  });
});
