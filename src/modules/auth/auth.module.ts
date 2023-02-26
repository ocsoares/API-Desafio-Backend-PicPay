import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '../user - EXAMPLE/user.module';
import { AuthService } from './auth.service';
import { LoginValidationBodyMiddleware } from './middlewares/login-validation-body.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [UserModule],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
    // Ativa o Middleware de Validar o BODY da Requisição para a rota de Login,
    // porque nesse caso precisa fazer desse jeito porque no LoginUserController
    // NÃO é usado um DTO !!!
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoginValidationBodyMiddleware).forRoutes('auth/login');
    }
}