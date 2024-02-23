import express from 'express';
import { createAddress, deleteAddress, getAddress, getAllAddresses, updateAddress } from '../controllers/addressController.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();


// create address
router.post('/create-address', verifyToken , createAddress);

// update address
router.put('/update-address/:addressId', updateAddress);

// get a address

router.get('/get-address/:addressId', getAddress);

// get all addresses
router.get('/get-all-addresses', verifyToken, getAllAddresses);

// delete address

router.delete('/delete-address/:addressId', deleteAddress);










export default router;
