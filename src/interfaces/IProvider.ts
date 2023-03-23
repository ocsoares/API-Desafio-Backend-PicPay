export interface IProvider {
    execute(data?: string | object): Promise<string | object>;
}
