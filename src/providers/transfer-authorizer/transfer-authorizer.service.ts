import { Injectable } from '@nestjs/common';
import { IProvider } from 'src/interfaces/IProvider';
import axios from 'axios';

@Injectable()
export class TransferAuthorizerService implements IProvider {
    async execute(): Promise<string> {
        const response = await axios.get('http://o4d9z.mocklab.io/notify');

        return response.data.message;
    }
}
