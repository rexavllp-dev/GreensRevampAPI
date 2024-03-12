import db from '../../config/dbConfig.js';


export const createASeason = async (seasonData) => {
    const season = await db('seasons')
        .insert(seasonData)
        .returning('*');

    return season;
};


export const updateASeason = async (seasonId, seasonData) => {
    const season = await db('seasons')
        .where({ season_id: seasonId })
        .update(seasonData)
        .returning('*');

    return season;
};


export const getASeason = async (seasonId) => {
    const season = await db('seasons')
        .where({ season_id: seasonId })
        .select('*');
    return season;
};


export const getsAllSeasons = async () => {
    const seasons = await db('seasons').select('*');
    return seasons;
};


export const deleteASeason = async (seasonId) => {
    const season = await db('seasons')
        .where({ season_id: seasonId })
        .del()
        .returning('*');

    return season;
};