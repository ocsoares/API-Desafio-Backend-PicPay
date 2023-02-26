import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayablesRepository } from '../../repositories/abstracts/PayablesRepository';
import { TransactionRepository } from '../../repositories/abstracts/TransactionRepository';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import { MongoosePayablesRepository } from '../../repositories/implementations/mongoose/payables/MongoosePayablesRepository';
import {
    Payables,
    PayablesSchema,
} from '../../repositories/implementations/mongoose/schemas/payables.schema';
import {
    Transaction,
    TransactionSchema,
} from '../../repositories/implementations/mongoose/schemas/transaction.schema';
import {
    User,
    UserSchema,
} from '../../repositories/implementations/mongoose/schemas/user.schema';
import { MongooseTransactionRepository } from '../../repositories/implementations/mongoose/transaction/MongooseTransactionRepository';
import { MongooseUserRepository } from '../../repositories/implementations/mongoose/user/MongooseUserRepository';
import { PayablesModule } from '../payables/payables.module';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';
import { MongooseInMemoryDatabaseModule } from './mongoose-in-memory-database.module';

// Esse Módulo é Global para que os Módulos dos use-cases consigam ter acesso ao ESCOPO dos seus Providers
// nesse Módulo aqui, sem isso NÃO funciona !!!
// OBS: Mesmo esse Módulo sendo Global, NÃO vai afetar a Aplicação FORA DOS TESTES, porque ele só vai ser Impor-
// tado APENAS no Módulo isolado no Teste !! <<
@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
        ]),
        MongooseModule.forFeature([
            { name: Payables.name, schema: PayablesSchema },
        ]),
        UserModule,
        PayablesModule,
        TransactionModule,
        MongooseInMemoryDatabaseModule, // Trocar o In Memory Database se for OUTRO Banco...
    ],
    providers: [
        {
            provide: UserRepository,
            useClass: MongooseUserRepository, // Trocar a Implementação do Repositório se for OUTRO Banco...
        },
        {
            provide: PayablesRepository,
            useClass: MongoosePayablesRepository,
        },
        {
            provide: TransactionRepository,
            useClass: MongooseTransactionRepository,
        },
    ],
    exports: [UserRepository, PayablesRepository, TransactionRepository],
})
export class TestDependenciesModule {}
