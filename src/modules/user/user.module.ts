import { Module } from '@nestjs/common';
import { LoginUserController } from './use-cases/login-user/login-user.controller';
import { LoginUserService } from './use-cases/login-user/login-user.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [CreateUserController, LoginUserController],
    providers: [CreateUserService, LoginUserService],
})
export class UserModule {}
