import {
  Get,
  UseGuards,
  Logger,
  HttpStatus,
  Controller,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTagsEnum } from 'src/enums/api.tags.enum';
import BaseResponse from 'src/models/base.response.model';
import { UserResponse } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';
import { ExceptionResponse } from 'src/utils/all.exception.filter';

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
    description: 'User',
  })
  @ApiUnauthorizedResponse({
    type: ExceptionResponse,
    description: 'Unauthorized',
  })
  @ApiBearerAuth('access-token')
  @ApiTags(ApiTagsEnum.USER)
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(@Headers() headers): Promise<BaseResponse<UserResponse>> {
    const response: any = await this.userService.getUsers(
      headers.authorization,
    );
    Logger.log(response);
    return new BaseResponse(HttpStatus.OK, 'Users', response);
  }
}
