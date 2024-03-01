import db from '../../config/dbConfig.js';

// update user account information

export const updateUserAccountInformation = async (userId, newData) => {
    const user = await db('users').where({ id: userId }).update(newData).returning('*');
    return user;
};



// create user account to company account
export const updateUserAccountToCompany = async (userId, newData) => {
 const user = await db('users').where({ id: userId }).update(newData).returning('*');
  return user;   
}


export const createCompany = async (data) => {
    const company = await db("company").insert(data).returning('*');
    return company;
  };


