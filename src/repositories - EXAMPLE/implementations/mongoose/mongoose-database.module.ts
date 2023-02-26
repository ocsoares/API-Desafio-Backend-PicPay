import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseUserRepository } from './user/MongooseUserRepository';

@Global() // Torna esse Módulo GLOBAL, ou seja, quando Importado em QUALQUER LUGAR, importa para TODOS !!!
@Module({
    imports: [
        ConfigModule.forRoot(), // Ativa as Variáveis de Ambiente DEFAULT (sem nada nos ()) !!
        MongooseModule.forRoot(process.env.ATLAS_URL_CONNECTION),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        // others...
    ],
    providers: [
        {
            provide: UserRepository,
            useClass: MongooseUserRepository,
        },
        // others...
    ],
    exports: [UserRepository,/* others... */ ],
})
export class MongooseDatabaseModule {}
