import db from '../../config/dbConfig.js';


export const createAFeed = async (feedData) => {
    const feed = await db('feeds')
        .insert(feedData)
        .returning('*');

    return feed;
};


export const updateAFeed = async (feedId, feedData) => {
    const feed = await db('feeds')
        .where({ feed_id: feedId })
        .update(feedData)
        .returning('*');

    return feed;
};


export const getAFeed = async (feedId) => {
    const feed = await db('feeds')
        .where({ feed_id: feedId })
        .select('*');
    return feed;
};


export const getsAllFeeds = async () => {
    const feeds = await db('feeds').select('*');
    return feeds;
};


export const deleteAFeed = async (feedId) => {
    const feed = await db('feeds')
        .where({ feed_id: feedId })
        .del()
        .returning('*');

    return feed;
};