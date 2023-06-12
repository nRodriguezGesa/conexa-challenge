import {
  Get,
  UseGuards,
  Logger,
  HttpStatus,
  Controller,
  Headers,
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
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTagsEnum } from 'src/enums/api.tags.enum';
import BaseResponse from 'src/models/base.response.model';
import { UserResponse } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';
import BaseExceptionResponse from 'src/utils/base.exception.response';

@Controller('user')
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
  @ApiTags(ApiTagsEnum.USER)
  @ApiQuery({
    name: 'q',
    required: false,
    explode: false,
    type: String,
  })
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
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(
    @Headers() headers,
    @Query('skip') skip = 0,
    @Query('limit') limit = 10,
    @Query('q') q = '',
  ): Promise<BaseResponse<UserResponse>> {
    const response: any = await this.userService.getUsers(
      headers.authorization,
      skip,
      limit,
      q,
    );
    Logger.log(response);
    return new BaseResponse(HttpStatus.OK, 'Users', response);
  }
}
