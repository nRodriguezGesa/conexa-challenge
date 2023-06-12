import {
  Get,
  UseGuards,
  Logger,
  HttpStatus,
  Controller,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTagsEnum } from '../enums/api.tags.enum';
import BaseResponse from '../models/base.response.mode';
import { UserResponse } from '../models/users.model';
import { UserService } from '../services/users.service';
import BaseExceptionResponse from 'src/utils/base.exception.response';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExtraModels(BaseResponse, UserResponse)
  @ApiCreatedResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            content: {
              type: 'array',
              items: { $ref: getSchemaPath(UserResponse) },
            },
          },
        },
      ],
    },
    description: 'Users',
  })
  @ApiUnauthorizedResponse({
    type: BaseExceptionResponse,
    description: 'Unauthorized',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'skip',
    required: false,
    explode: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    explode: false,
    type: Number,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    explode: false,
    type: String,
  })
  @ApiTags(ApiTagsEnum.USER)
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(
    @Query('skip') skip = 0,
    @Query('limit') limit = 10,
    @Query('q') q = '',
  ): Promise<BaseResponse<UserResponse[]>> {
    if (skip < 0) {
      throw new BaseExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Invalid skip value',
      );
    }
    const response: any = await this.userService.getUsers(skip, limit, q);
    Logger.log(response);
    return new BaseResponse(HttpStatus.OK, 'Users', response);
  }
}
