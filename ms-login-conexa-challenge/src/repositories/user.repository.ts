import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InputUserDto } from 'src/models/user.model';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async registerUser(inputUserDto: InputUserDto): Promise<User> {
    return await this.userModel.create(inputUserDto);
  }

  async findUser(inputUserDto: InputUserDto): Promise<User> {
    return await this.userModel.findOne({ mail: inputUserDto.mail });
  }
}
