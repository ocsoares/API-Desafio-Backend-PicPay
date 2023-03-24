import { Injectable } from '@nestjs/common';
import { IProvider } from 'src/interfaces/IProvider';
import axios from 'axios';

@Injectable()
export class SendNotifyService implements IProvider {
    async execute(): Promise<string | object> {
        const response = await axios.get('http://o4d9z.mocklab.io/notify');

        return response.data.message;
    }
}
