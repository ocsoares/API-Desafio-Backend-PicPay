import { Global, Module } from '@nestjs/common';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { UserModule } from '../user/user.module';
import { UserRepositorySQLInMemory } from './sql-in-memory/user-repository-sql-in-memory.service';

@Global()
@Module({
    imports: [UserModule],
    providers: [
        {
            provide: UserRepository,
            useClass: UserRepositorySQLInMemory,
        },
    ],
    exports: [UserRepository],
})
export class TestDependenciesModule {}
