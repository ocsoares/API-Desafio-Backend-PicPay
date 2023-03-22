export interface IUserPayload {
    readonly sub: string;
    readonly full_name: string;
    readonly email: string;
    readonly iat?: string;
    readonly exp?: number;
}
