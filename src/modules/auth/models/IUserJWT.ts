export interface IUserJWT {
    readonly id: string;
    readonly role: 'user' | 'shopkeeper';
    readonly full_name: string;
    readonly email: string;
}
