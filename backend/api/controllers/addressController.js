import {
    createUserAddress,
    deleteUserAddress,
    getAllUserAddresses,
    getUserAddress,
    getUserAddresses,
    updateOtherUserAddress,
    updateUserAddress
} from "../models/addressModel.js";


// create address
export const createAddress = async (req, res) => {

    try {

        const addressData = req.body;
        const userId = req.user.userId;
        console.log(userId);


        const userAddresses = await getUserAddresses(userId);


        if (userAddresses.length === 0) {
            // User has no addresses, set is_default to true for the new address
            addressData.is_default = true;
        } else {
            // User has existing addresses
            if (addressData.is_default) {
                // Find the current default address
                const defaultAddressIndex = userAddresses.findIndex(address => address.is_default === true);
                if (defaultAddressIndex !== -1) {
                    // Set is_default to false for the current default address
                    userAddresses[defaultAddressIndex].is_default = false;
                    // Update the existing default address in the database
                    await updateOtherUserAddress(userId, userAddresses[defaultAddressIndex].id);
                }
            }
        };

        const address = await createUserAddress(addressData);

        res.status(200).json({
            status: 200,
            success: true,
            result: address,
            message: 'Address created successfully',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed to create address. Please try again later.',
        })
    }
};

// update address

export const updateAddress = async (req, res) => {

    const addressData = req.body;
    const addressId = req.params.addressId;

    console.log('Received address data:', addressData); // Log the received data
    try {

        if (!addressId) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Address not found.'
            });
        }

        const userAddresses = await getUserAddresses(req.user?.id);
        
        if (userAddresses.length === 0) {
            // User has no addresses, set is_default to true for the new address
            addressData.is_default = true;
        } else {
            // User has existing addresses
            if (addressData.is_default) {
                // Find the current default address
                const defaultAddressIndex = userAddresses.findIndex(address => address.is_default === true);
                if (defaultAddressIndex !== -1) {
                    // Set is_default to false for the current default address
                    userAddresses[defaultAddressIndex].is_default = false;
                    // Update the existing default address in the database
                    await updateOtherUserAddress(userId, userAddresses[defaultAddressIndex].id);
                }
            }
        };

        const address = await updateUserAddress(addressData, addressId);

        // Update other addresses
        await updateOtherUserAddress(req.user?.id, addressId);

        res.status(200).json({
            status: 200,
            success: true,
            result: address,
            message: 'Address updated successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to update address. Please try again later.'
        })
    }
}

// get a address by id

export const getAddress = async (req, res) => {

    const addressId = req.params.addressId;

    try {

        const address = await getUserAddress(addressId);

        if (!address) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Address not found.'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            result: address,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get address. Please try again later.'
        })
    }


}

// get all addresses

export const getAllAddresses = async (req, res) => {

    try {
        const addresses = await getAllUserAddresses();
        res.status(200).json({
            status: 200,
            success: true,
            result: addresses,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to get addresses. Please try again later.'
        })
    }
}

// delete address

export const deleteAddress = async (req, res) => {

    const addressId = req.params.addressId;

    try {

        const address = await deleteUserAddress(addressId);

        if (!address) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Address not found.'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            result: address,
            message: 'Address deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error,
            message: 'Failed to delete address. Please try again later.'
        })
    }
};


