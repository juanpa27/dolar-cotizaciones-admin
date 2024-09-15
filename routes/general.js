import express from 'express';
import { getAllExchangeRates } from '../controllers/generalController.js'; // Asegúrate de incluir la extensión .js en los imports

const router = express.Router();

// Definir la ruta
router.get('/', getAllExchangeRates);

// Exportar el router usando export default
export default router;