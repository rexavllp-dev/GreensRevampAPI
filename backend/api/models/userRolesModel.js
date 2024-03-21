import db from '../../config/dbConfig.js';


export const createARole = async (data) => {

    const role = await db('user_roles')
        .insert(data)
        .returning('*');

    return role;
};


export const updateARole = async (roleId, data) => {

    const role = await db('user_roles')
        .where({ role_id: roleId })
        .update(data)
        .returning('*');

    return role;
};



export const getsAllRoles = async () => {

    const roles = await db('user_roles').select('*');

    return roles;
};