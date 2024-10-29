import express from 'express';
import { getAllExchangeRates,
    getExchangeRatesByProvider,
    getExchangeRatesByDate
 } from '../controllers/generalController.js'; 

const router = express.Router();

// Definir la ruta
router.get('/', getAllExchangeRates);
router.get('/provider/:provider', getExchangeRatesByProvider); 
router.get('/date/:date', getExchangeRatesByDate);


export default router;