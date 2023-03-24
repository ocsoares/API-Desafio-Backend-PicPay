import { Injectable } from '@nestjs/common';
import { IProvider } from 'src/interfaces/IProvider';
import axios from 'axios';

@Injectable()
export class TransferAuthorizerService implements IProvider {
    async execute(): Promise<string> {
        const response = await axios.get(
            'https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6',
        );

        return response.data.message;
    }
}
