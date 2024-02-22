import db from '../../config/dbConfig.js';

export const createUserAddress = async (addressData) => {
    const address = await db('address').insert(addressData);
    return address;
}

// update address 

export const updateUserAddress = async (addressData, addressId) => {

    const address = await db('address')
        .where({ id: addressId })
        .update(addressData)
        .returning('*');

    return address;
}

// get a address by id

export const getUserAddress = async (addressId) => {

    const address = await db('address')
        .where({ id: addressId })
        .first();
    return address;
}



// delete address

export const deleteUserAddress = async (addressId) => {

    const address = await db('address')
        .where({ id: addressId })
        .del();

    return address;
}

// get user address by user id

export const getUserAddresses = async (userId) => {
    const address = await db('address')
        .where({ user_id: userId })
        .select('*')
        .first();
    return address;
};

// update other address 

export const updateOtherUserAddress = async (userId, addressId) => {

    const addresses = await getUserAddresses(userId);
    for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].id !== addressId) {
            const updatedAddress = { ...addresses[i], is_default: false };
            await updateUserAddress(updatedAddress, addresses[i].id);
        }
    }

};

