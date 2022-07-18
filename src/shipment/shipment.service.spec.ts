import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { ShipmentStatus } from './shipment-status.enums';
import { ShipmentService } from './shipment.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
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
  });
});
