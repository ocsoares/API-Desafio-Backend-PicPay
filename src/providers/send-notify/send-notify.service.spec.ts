import { SendNotifyService } from './send-notify.service';
import axios from 'axios';

describe('SendNotifyService', () => {
    let sendNotifyService: SendNotifyService;

    beforeEach(() => {
        sendNotifyService = new SendNotifyService();

        jest.spyOn(axios, 'get');
    });

    it('should be defined', () => {
        expect(sendNotifyService).toBeDefined();
    });

    it('should return a message from the notify API', async () => {
        const response = await sendNotifyService.execute();

        expect(axios.get).toHaveBeenCalledWith(
            'http://o4d9z.mocklab.io/notify',
        );

        expect(typeof response).toBe('string');
    }, 20000);
});
