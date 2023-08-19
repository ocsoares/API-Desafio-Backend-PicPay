import { CronJob } from 'cron';
import axios from 'axios';

const url = 'https://api-desafio-backend-picpay.onrender.com';

console.log('Cron job running');

// Run every 5 minutes to keep deploy's server alive
new CronJob(
    '*/5 * * * *',
    async () => {
        try {
            await axios.get(url);
        } catch (error) {
            console.log(error);
        }
    },
    null,
    true,
);
