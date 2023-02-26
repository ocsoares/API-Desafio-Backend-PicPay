export interface IUserPayload {
    readonly sub: string;
    readonly name: string;
    readonly email: string;
    readonly iat?: string;
    readonly exp?: number;
}
