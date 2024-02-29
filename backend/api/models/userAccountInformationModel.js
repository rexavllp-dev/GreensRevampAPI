
// update user account information
export const updateUserAccountInformation = async (userId, newData) => {
    const user = await db('users').where({ id: userId }).update(newData).returning('*');
    return user;
};

