import db from "../../config/dbConfig.js";


export const createAMail = async (mailData) => {
    const mail = await db('admin_mail').insert(mailData).returning('*');
    return mail;
};


export const updateAMail = async (mailId, mailData) => {
    const mail = await db('admin_mail')
        .where({ mail_id: mailId })
        .update(mailData)
        .returning('*');

    return mail;
};


export const getAMail = async (mailId) => {
    const mailData = await db('admin_mail')
        .where({ mail_id: mailId })
        .select('*')
        .first();

    return mailData;
};



export const getsAllMail = async () => {
    const mailData = await db('admin_mail')
        .select('*');

    return mailData;
};