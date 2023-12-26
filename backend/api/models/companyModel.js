import db from '../../config/dbConfig.js';

// creating a function user for register a company
export const createUser = async (data) => {
  const newUser = await db("users").insert(data).returning('*');
  return newUser;

};

// creating a function createCompany for register a company
export const createCompany = async (data) => {
  const company = await db("company").insert(data).returning('*');
  return company;
};


export const checkCompanyExist = async (company_trn_number) => {
  const company = await db('company').select('id').where({ company_trn_number });
  return company;
};


// image upload and resize 
export const saveFileRecord = async (vatImg) => {
const images = await db('company').insert({company_vat_certificate: vatImg}).returning('*');
return images;
};