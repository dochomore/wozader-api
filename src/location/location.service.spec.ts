import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';

const mockRepository = () => ({});

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
});
