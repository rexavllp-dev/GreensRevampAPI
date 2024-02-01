import db from '../../config/dbConfig.js';

export const createUserAddress = async (addressData) => {
    const address = await db('address').insert(addressData);
    return address;
}

// update address 

export const updateUserAddress = async (addressData, addressId) => {

    const address = await db('address')
    .where({ id:addressId })
    .update(addressData)
    .returning('*');

    return address;
}

// get a address by id

export const getUserAddress = async (addressId) => {

    const address = await db('address')
    .where({ id:addressId })
    .first();
    return address;
}

export const getAllUserAddresses = async () => {

    const addresses = await db('address');
    return addresses;
}

// delete address

export const deleteUserAddress = async (addressId) => {

    const address = await db('address')
    .where({ id:addressId })
    .del();

    return address;
}

// get user address by user id

export const getUserAddresses = async (userId) => {
    const address = await db('address')
    .where({ user_id:userId })
    .select('*')
    // .first();
    return address;
} 