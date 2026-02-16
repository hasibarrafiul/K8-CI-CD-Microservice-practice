import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createProfile(data: { userId: number; email: string }) {
    const newUser = this.userRepository.create({
      email: data.email,
      // userId from Auth can be mapped to our internal ID or a separate column
    });
    return this.userRepository.save(newUser);
  }

  async searchUsers(query: string) {
    return this.userRepository.find({
      where: [
        { email: Like(`%${query}%`) },
        { name: Like(`%${query}%`) }
      ]
    });
  }
}