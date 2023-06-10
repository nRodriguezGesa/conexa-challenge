import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export default class BaseResponse<T> {
  @ApiProperty()
  @IsString()
  responseCode: number;
  @ApiProperty()
  @IsString()
  message: string;
  content?: T;

  constructor(responseCode: number, message: string, content: T) {
    this.responseCode = responseCode;
    this.message = message;
    this.content = content;
  }
}
