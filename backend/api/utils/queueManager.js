import PgBoss from 'pg-boss';
import dotEnv from 'dotenv';
import { sendOrderInvoices } from './emailer.js';
import { generateInvoice } from '../helpers/generateInvoice.js';

dotEnv.config();


export const sendEmailQueueManager = async (order) => {

    const boss = new PgBoss(process.env.DB_URL);

    boss.on('error', error => console.error(error));

    await boss.start();

    const queue = 'email-queue';

    let jobId = await boss.send(queue, { order });
    console.log(`Created job in queue ${queue}: ${jobId}`);

    // Start processing jobs from the queue
    await boss.work(queue, someAsyncJobHandler);
    return true;
}

async function someAsyncJobHandler(job) {

    try {

        console.log(`Started processing jobs in queue ${job.name}: ${job.id}`);
        let order = job.data?.order;

        

            async function asyncHandler() {
                try {
                    const pdfData = await generateInvoice(order);
                    await sendOrderInvoices(order, pdfData);
                } catch (error) {
                    console.log(error);
                }
            }
            await asyncHandler()

        

    } catch (e) {
        console.log(e)
    }
};