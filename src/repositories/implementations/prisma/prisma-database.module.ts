import { Global, Module } from '@nestjs/common';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
import { PrismaService } from './prisma-client.service';
import { PrismaUserRepository } from './user/PrismaUserRepository';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class PrismaDatabaseModule {}
