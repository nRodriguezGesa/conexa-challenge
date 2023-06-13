import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../utils/jwt.constants';
import { UserController } from '../controllers/users.controller';
import { UserService } from '../services/users.service';
import { UserRepository } from '../repositories/users.repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '360s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class BussinessModule {}
