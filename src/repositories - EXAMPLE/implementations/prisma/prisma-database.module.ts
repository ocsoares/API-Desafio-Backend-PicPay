import { Global, Module } from '@nestjs/common';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
import { PrismaService } from './prisma-client.service';
import { PrismaUserRepository } from './user/PrismaUserRepository';

@Global() // Torna esse Módulo GLOBAL, ou seja, quando Importado em QUALQUER LUGAR, importa para TODOS !!!
@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        // others...
    ],
    exports: [UserRepository, /* others... */],
})
export class PrismaDatabaseModule {}
