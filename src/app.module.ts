import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { LoginValidationBodyModule } from './modules/login-validation-body/login-validation-body.module';
import { PrismaDatabaseModule } from './repositories/implementations/prisma/prisma-database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaDatabaseModule,
        UserModule,
        AuthModule,
        LoginValidationBodyModule,
    ],
    providers: [
        {
            // Ativa GLOBALMENTE o JwtAuthGuard para a Aplicação, e para DESATIVAR para uma Rota,
            // usar o Decorator Personalizado @IsPublic() no Controller !!!
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
