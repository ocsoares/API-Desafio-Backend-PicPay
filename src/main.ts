import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/app';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api'); // Todas os Controllers dessa aplicação INTEIRA vai começar com /api !!

    // Habilita as Verificações do Body da Aplicação !!
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // NÃO permite passar mais Campos no Body do que o Solicitado !
            forbidNonWhitelisted: true, // Passa um ERRO caso tenha um Campo não solicitado (erro para o whitelist acima) !
        }),
    );

    await app.listen(PORT);
}

bootstrap();
