import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import {
  AuthResponse,
  InputUserDto,
  UserResponse,
} from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/schemas/user.schema';
import PasswordHandler from 'src/utils/password.handler';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { UserModuleEndpointsEnum } from 'src/enums/user.module.endpoints.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}
  async registerUser(inputUserDto: InputUserDto): Promise<UserResponse> {
    inputUserDto.password = await PasswordHandler.hashPassword(
      inputUserDto.password,
    );
    const user: User = await this.userRepository.findUser(inputUserDto);
    if (user != null) {
      throw new ConflictException('Duplicate mail');
    }
    return new UserResponse(
      await this.userRepository.registerUser(inputUserDto),
    );
  }

  async login(inputUserDto: InputUserDto): Promise<AuthResponse> {
    const user: User = await this.userRepository.findUser(inputUserDto);
    if (user == null) {
      throw new NotFoundException('Mail not found');
    }
    if (
      !(await PasswordHandler.comparePassword(
        inputUserDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException();
    }
    return new AuthResponse(
      await this.jwtService.signAsync({
        sub: user._id.toString(),
        username: user.mail,
      }),
    );
  }

  async getUsers(auth: string): Promise<UserResponse[]> {
    const access_token = auth.replace('Bearer ', '');
    console.log(access_token);
    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
      Authorization: `Bearer ${access_token}`,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `${process.env.USER_MODULE_BASE_URL}${UserModuleEndpointsEnum.USERS}`,
          {
            headers: headersRequest,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    Logger.log(JSON.stringify(data.content));
    const responseUsers = [];
    data.content.forEach((user: User) => {
      responseUsers.push(new UserResponse(user));
    });
    return responseUsers;
  }
}
