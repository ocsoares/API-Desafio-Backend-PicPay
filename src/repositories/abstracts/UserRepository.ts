import { IUser } from 'src/models/IUser';

export abstract class UserRepository {
    abstract create(data: IUser): Promise<IUser>;
    abstract findByCPF(cpf: string): Promise<IUser>;
    abstract findByEmail(email: string): Promise<IUser>;
}
