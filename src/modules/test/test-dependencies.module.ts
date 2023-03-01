import { Global, Module } from '@nestjs/common';
import { PrismaUserRepository } from 'src/repositories/implementations/prisma/user/PrismaUserRepository';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { UserModule } from '../user/user.module';

@Global()
@Module({
    imports: [
        UserModule,
        // COLOCAR UMA DATABASE IN MEMORY AQUI !!
    ],
    providers: [
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class TestDependenciesModule {}
