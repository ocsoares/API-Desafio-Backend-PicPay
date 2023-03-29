export interface IReturnMeUser {
    readonly role: 'user' | 'shopkeeper';
    readonly full_name: string;
    readonly email: string;
    readonly balance: number;
}
