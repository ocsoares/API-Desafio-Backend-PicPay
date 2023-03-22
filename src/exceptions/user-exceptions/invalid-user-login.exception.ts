export const invalidUserLoginExceptionMessage = 'Email ou senha incorreto(s) !';

export class InvalidUserLoginException extends Error {
    constructor() {
        super(invalidUserLoginExceptionMessage);
    }
}
