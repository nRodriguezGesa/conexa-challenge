import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import BaseResponse from 'src/models/base.response.model';
import {
  AuthResponse,
  InputUserDto,
  UserResponse,
} from 'src/models/user.model';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionResponse } from 'src/utils/all.exception.filter';
import { ApiTagsEnum } from 'src/enums/api.tags.enum';

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @ApiExtraModels(BaseResponse, UserResponse)
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            content: {
              $ref: getSchemaPath(UserResponse),
            },
          },
        },
      ],
    },
    description: 'User created successfully',
  })
  @ApiConflictResponse({
    type: ExceptionResponse,
    description: 'Duplicate mail',
  })
  @ApiTags(ApiTagsEnum.LOGIN)
  @ApiBody({ type: InputUserDto })
  @Post('/register')
  async registerUser(
    @Body() inputUserDto: InputUserDto,
  ): Promise<BaseResponse<UserResponse>> {
    const response: UserResponse = await this.userService.registerUser(
      inputUserDto,
    );
    Logger.log(JSON.stringify(response));
    return new BaseResponse(HttpStatus.CREATED, 'User created', response);
  }

  @ApiExtraModels(BaseResponse, AuthResponse)
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            content: {
              $ref: getSchemaPath(AuthResponse),
            },
          },
        },
      ],
    },
    description: 'User created successfully',
  })
  @ApiNotFoundResponse({
    type: ExceptionResponse,
    description: 'Mail not found',
  })
  @ApiUnauthorizedResponse({
    type: ExceptionResponse,
    description: 'Incorrect password',
  })
  @ApiTags(ApiTagsEnum.LOGIN)
  @ApiBody({ type: InputUserDto })
  @Post()
  async login(
    @Body() inputUserDto: InputUserDto,
  ): Promise<BaseResponse<AuthResponse>> {
    const response = await this.userService.login(inputUserDto);
    Logger.log(JSON.stringify(response));
    return new BaseResponse(HttpStatus.ACCEPTED, 'Login successfull', response);
  }
}
