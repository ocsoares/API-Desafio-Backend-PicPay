import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/models/IUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { User, UserDocument } from '../schemas/user.schema';

// PRECISA desse @Injectable para Injetar no Repositório que está chamando lá no providers !!!

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(
        @InjectModel(User.name) private _userModel: Model<UserDocument>,
    ) {}

    // IUser pq ele tem Id como opcional, e preciso dele para Verificar se o Usuário JÁ existe !!
    async create(data: IUser): Promise<IUser> {
        const newUser = await this._userModel.create(data);

        // Setando o ID da Interface IUser nesse Documento do Mongo criado !!!
        // OBS: O id está DECLARADO em user.schema como opcional, mas aqui eu estou SETANDO ele com
        // o MESMO valor de _id !!!
        // eslint-disable-next-line prefer-destructuring
        newUser.id = newUser._id;
        await newUser.save();

        return newUser.toObject(); // Usar .toObject para retornar o Objeto newUser APENAS e não o Documento gigante do Mongo !!
    }

    async findById(id: string): Promise<IUser> {
        const user = await this._userModel.findById(id);

        // Tive que fazer assim porque se o Objeto NÃO existir, o .toObject() vai dar ERRO !!!
        // OBS: Como isso não traz o Objeto gigante do Mongo, auxilia nos Testes !!!
        return user ? user.toObject() : undefined;
    }

    async findByName(name: string): Promise<IUser> {
        const user = await this._userModel.findOne({ name });

        return user ? user.toObject() : undefined;
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = await this._userModel.findOne({ email });

        return user ? user.toObject() : undefined;
    }
}
