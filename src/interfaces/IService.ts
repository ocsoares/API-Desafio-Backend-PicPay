export interface IService {
    execute(data?: string | object): Promise<string | object>;
}
