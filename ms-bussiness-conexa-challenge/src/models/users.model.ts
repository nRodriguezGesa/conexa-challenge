import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsMongoId, IsEmail, IsStrongPassword } from 'class-validator';
import { User } from '../schemas/users.schema';

class BaseUser {
  @ApiProperty({
    description: 'Mongo id',
    readOnly: true,
    minimum: 1,
  })
  @IsMongoId()
  _id: string;
  @ApiProperty({ description: 'email address', example: 'test@test.com' })
  @IsEmail()
  mail: string;
  @IsStrongPassword()
  @ApiProperty({
    description: 'unHashed password',
    example: 'abcd1234$$ADC',
    minLength: 8,
  })
  password: string;
}
export class InputUserDto extends OmitType(BaseUser, ['_id'] as const) {}
export class UserResponse extends OmitType(BaseUser, [
  'password',
  '_id',
] as const) {
  constructor(user: User) {
    super();
    this.mail = user.mail;
  }
}

export class AuthResponse {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
