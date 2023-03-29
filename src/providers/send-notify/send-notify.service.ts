import { Injectable } from '@nestjs/common';
import { IProvider } from 'src/interfaces/IProvider';
import axios from 'axios';

// Essa API externa possui um limite de requisição mensal, então não vou retornar erro se
// der esse erro mencionado
export const exceededMonthlyRequestQuotaErrorMessage =
    'Monthly request quota has been exceeded. Visit https://app.mocklab.io/account/subscriptions to upgrade.';

@Injectable()
export class SendNotifyService implements IProvider {
    async execute(): Promise<string> {
        try {
            const response = await axios.get('http://o4d9z.mocklab.io/notify');

            return response.data.message;
        } catch (error) {
            return error.response.data.errors[0];
        }
    }
}
