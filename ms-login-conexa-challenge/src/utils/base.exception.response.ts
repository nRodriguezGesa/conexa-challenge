import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export default class BaseExceptionResponse extends HttpException {
  @ApiProperty()
  @IsString()
  responseCode: number;
  @ApiProperty()
  @IsString()
  errorMessage: string;

  constructor(responseCode: number, errorMessage: string) {
    super(errorMessage, responseCode);
  }
}
