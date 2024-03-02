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
// _____________________________________________________________________________________________________________________________________________


export const updateCompanyUser = async (userId, data) => {
  const newUser = await db("users")
  .where({ id: userId })
  .update(data)
  .returning('*');
  return newUser;
};


export const updateCompany = async (companyId, data) => {
  console.log(companyId);
  const company = await db("company")
    .where({ id: companyId }).update(data).returning('*');
    console.log(data);
  return company;
};




export const getCurrentUserCompanyTrn = async (userId) => {
  const companyTrn = await db('users')
    .leftJoin('company', 'users.usr_company', 'company.id')
    .select(
      'company.id',
      'company.company_trn_number'
      )
    .where({ 'users.id': userId })
    .first();

  return companyTrn;
}