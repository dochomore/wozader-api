import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        { provide: getRepositoryToken(Location), useValue: {} },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create new Location', async () => {
      const location: any = {};
      const locationDto: any = {};

      const spy = jest.spyOn(service, 'create').mockResolvedValue(location);
      expect(controller.create(locationDto)).resolves.toEqual(location);
      expect(spy).toHaveBeenCalledWith(locationDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException', async () => {
      const locationDto: any = {};

      const spy = jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      expect(controller.create(locationDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(spy).toHaveBeenCalledWith(locationDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
