import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationService: Repository<Location>,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const location = this.locationService.create({ ...createLocationDto });
    try {
      return await this.locationService.save(location);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findAll() {
    try {
      return await this.locationService.find();
    } catch (err) {
      return new BadRequestException();
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.locationService.findOneBy({ locationId: id });
      if (!result) {
        throw new NotFoundException();
      }
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const result: UpdateResult = await this.locationService.update(id, {
        ...updateLocationDto,
      });
      if (result.affected === 0) {
        throw new NotFoundException();
      }
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      const result: DeleteResult = await this.locationService.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException();
      }
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
