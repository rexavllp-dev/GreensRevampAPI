import express from 'express';
import { getAllCountries, registerCountry } from '../controllers/countryController.js';




// country routes

const router = express.Router();


// register  routes
router.post('/', registerCountry);

// get all countries
router.get('/getall', getAllCountries)


export default router;