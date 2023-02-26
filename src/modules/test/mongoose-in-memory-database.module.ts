import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => {
                const mongoMemoryServer = await MongoMemoryServer.create();
                const uri = mongoMemoryServer.getUri();

                return {
                    uri,
                };
            },
        }),
    ],
})
export class MongooseInMemoryDatabaseModule {}
