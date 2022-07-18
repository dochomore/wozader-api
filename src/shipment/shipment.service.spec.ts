import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentService } from './shipment.service';

const mockRepository = () => ({});
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
});
