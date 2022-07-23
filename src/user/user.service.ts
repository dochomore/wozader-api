import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<User | BadRequestException> {
    try {
      const user = await this.userRepository.create({ ...createUserDto });

      const result = await this.userRepository.save(user);
      if (!result) {
        throw new BadRequestException();
      }
      return result;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<User[] | BadRequestException> {
    try {
      const result = await this.userRepository.find();
      if (!result) {
        throw new BadRequestException();
      }
      return result;
    } catch (error) {
      return new BadRequestException();
    }
  }

  async findOneById(id: string): Promise<User | NotFoundException> {
    try {
      const result = await this.userRepository.findOneBy({ userId: id });
      if (!result) {
        throw new NotFoundException();
      }
      return result;
    } catch (error) {
      return new NotFoundException();
    }
  }
  async findOneByUsername(username: string): Promise<User | NotFoundException> {
    try {
      const result = await this.userRepository.findOneBy({
        username: username,
      });
      if (!result) {
        throw new NotFoundException();
      }
      return result;
    } catch (error) {
      return new NotFoundException();
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | NotFoundException> {
    try {
      const updateResult = await this.userRepository.update(id, {
        ...updateUserDto,
      });

      if (updateResult.affected === 0) {
        throw new NotFoundException();
      }
      return updateResult;
    } catch (error) {
      return new NotFoundException();
    }
  }

  async remove(id: string): Promise<DeleteResult | NotFoundException> {
    try {
      const deleteResult = await this.userRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException();
      }
      return deleteResult;
    } catch (error) {
      return new NotFoundException();
    }
  }
}
