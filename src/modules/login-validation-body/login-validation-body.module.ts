import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoginValidationBodyMiddleware } from '../auth/middlewares/login-validation-body.middleware';

@Module({})
export class LoginValidationBodyModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoginValidationBodyMiddleware).forRoutes('auth/login');
    }
}
