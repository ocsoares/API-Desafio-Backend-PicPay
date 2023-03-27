import { TransferAuthorizerService } from './transfer-authorizer.service';
import axios from 'axios';

describe('TransferAuthorizerService', () => {
    let transferAuthorizerService: TransferAuthorizerService;

    beforeEach(() => {
        transferAuthorizerService = new TransferAuthorizerService();

        jest.spyOn(axios, 'get');
    });

    it('should be defined', () => {
        expect(transferAuthorizerService).toBeDefined();
    });

    it('should return a message from the authorizer API', async () => {
        const response = await transferAuthorizerService.execute();

        expect(axios.get).toHaveBeenCalledWith(
            'https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6',
        );

        expect(typeof response).toBe('string');
    });
});
