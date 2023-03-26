import { Global, Module } from '@nestjs/common';
import { NotifyRepository } from '../../repositories/abstracts/NotifyRepository';
import { TransferRepository } from '../../repositories/abstracts/TransferRepository';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { TransferModule } from '../transfer/transfer.module';
import { UserModule } from '../user/user.module';
import { NotifyRepositorySQLInMemory } from './sql-in-memory/notify-repository-sql-in-memory.service';
import { TransferRepositorySQLInMemory } from './sql-in-memory/transfer-repository-sql-in-memory.service';
import { UserRepositorySQLInMemory } from './sql-in-memory/user-repository-sql-in-memory.service';

@Global()
@Module({
    imports: [UserModule, TransferModule],
    providers: [
        {
            provide: UserRepository,
            useClass: UserRepositorySQLInMemory,
        },
        {
            provide: TransferRepository,
            useClass: TransferRepositorySQLInMemory,
        },
        {
            provide: NotifyRepository,
            useClass: NotifyRepositorySQLInMemory,
        },
    ],
    exports: [UserRepository, TransferRepository, NotifyRepository],
})
export class TestDependenciesModule {}
