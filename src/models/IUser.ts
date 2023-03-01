export interface IUser {
    readonly id?: string;
    readonly full_name: string;
    readonly cpf: string;
    readonly email: string;
    readonly password: string;
    readonly balance?: number;
}
