export interface returnHandle {
    message: string;
    data?: any;
}

export interface IController {
    handle(...args: object[]): Promise<returnHandle>;
}
