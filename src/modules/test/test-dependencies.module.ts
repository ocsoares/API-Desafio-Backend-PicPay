import { Global, Module } from '@nestjs/common';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { UserModule } from '../user/user.module';
import { SQLInMemoryUserRepository } from './sql-in-memory/sql-in-memory-user-repository.service';

@Global()
@Module({
    imports: [UserModule],
    providers: [
        {
            provide: UserRepository,
            useClass: SQLInMemoryUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class TestDependenciesModule {}
