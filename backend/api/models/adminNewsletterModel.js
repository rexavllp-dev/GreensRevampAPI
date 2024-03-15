import db from "../../config/dbConfig.js";


export const createANewsletter = async (newsletterData) => {
    const newsletter = await db('admin_newsletter').insert(newsletterData).returning('*');
    return newsletter;
};



export const updateANewsletter = async (newsletterId, newsletterData) => {
    const newsletter = await db('admin_newsletter')
        .where({ newsletter_id: newsletterId })
        .update(newsletterData)
        .returning('*');

    return newsletter;

};




export const getANewsletter = async (newsletterId) => {
    const newsletterData = await db('admin_newsletter')
        .where({ newsletter_id: newsletterId })
        .select('*')
        .first();

    return newsletterData;
};



export const getsAllNewsletter = async () => {
    const newsletterData = await db('admin_newsletter')
        .select('*');

    return newsletterData;
};  