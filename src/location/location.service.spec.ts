import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
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
});
