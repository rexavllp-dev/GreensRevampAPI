import express from 'express';
import { registerCompany } from '../controllers/companyController.js';


// company routes

const router = express.Router();


// register  routes
router.post('/', registerCompany);


export default router;