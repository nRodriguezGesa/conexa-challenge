import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  path: string;
  @ApiProperty()
  errorType: string;
  @ApiProperty()
  errorMessage: string;

  constructor(
    statusCode: number,
    path: string,
    errorType: string,
    errorMessage: string,
  ) {
    this.statusCode = statusCode;
    this.path = path;
    this.errorType = errorType;
    this.errorMessage = errorMessage;
  }
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseMessage = (type, message) => {
      response
        .status(status)
        .json(new ExceptionResponse(status, request.url, type, message));
    };

    if (exception.message) {
      responseMessage('Error', exception.message);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
