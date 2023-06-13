import { Injectable } from '@nestjs/common';
import { UserResponse } from '../models/users.model';
import { UserRepository } from '../repositories/users.repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(
    skip: number,
    limit: number,
    q: string,
  ): Promise<UserResponse[]> {
    return await this.userRepository.findAllUsers(skip, limit, q);
  }
}
