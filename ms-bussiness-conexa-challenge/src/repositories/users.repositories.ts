import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAllUsers(skip: number, limit: number, q: string): Promise<User[]> {
    return await this.userModel
      .find({ mail: new RegExp(q, 'i') })
      .limit(limit)
      .skip(skip);
  }
}
