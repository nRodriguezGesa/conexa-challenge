import { Injectable } from '@nestjs/common';
import { UserResponse } from '../models/users.model';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/users.repositories';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(
    skip: number,
    limit: number,
    q: string,
  ): Promise<UserResponse[]> {
    return await this.userRepository.findAllUsers(skip, limit, q);
  }
}
