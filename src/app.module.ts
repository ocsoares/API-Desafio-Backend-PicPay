import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { PayablesModule } from './modules/payables/payables.module';
import { LoginValidationBodyModule } from './modules/login-validation-body/login-validation-body.module';
import { PrismaDatabaseModule } from './repositories/implementations/prisma/prisma-database.module';
// import { MongooseDatabaseModule } from './repositories/implementations/mongoose/mongoose-database.module';

// IMPORTANTE: Como os Módulos de Banco de Dados são GLOBAIS, só vão funcionar FORA DOS TESTES, porque nos
// Testes cria-se um módulo PRÓPRIO para Testes, logo NÃO VAI funcionar neles, então deve-se Importar o
// Banco de Dados em CADA TESTE !!! <<<

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaDatabaseModule,
        UserModule,
        AuthModule,
        TransactionModule,
        LoginValidationBodyModule,
        PayablesModule,
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
