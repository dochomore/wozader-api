import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentController } from './shipment.controller';
import { ShipmentService } from './shipment.service';

describe('ShipmentController', () => {
  let controller: ShipmentController;
  let service: ShipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentController],
      providers: [
        ShipmentService,
        { provide: getRepositoryToken(Shipment), useValue: {} },
      ],
    }).compile();

    controller = module.get<ShipmentController>(ShipmentController);
    service = module.get<ShipmentService>(getRepositoryToken(Shipment));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
