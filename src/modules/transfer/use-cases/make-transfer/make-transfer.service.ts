import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';

@Injectable()
export class MakeTransferService implements IService {
    async execute(data?: string | object): Promise<string | object> {
        return null;
    }
}
