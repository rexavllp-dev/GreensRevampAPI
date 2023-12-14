import express from 'express';
import { registerCountry } from '../controllers/countryController.js';



// country routes

const router = express.Router();


// register  routes
router.post('/', registerCountry);


export default router;