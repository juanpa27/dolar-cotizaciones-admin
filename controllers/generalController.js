const pool = require('../models/db');

const getAllExchangeRates = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.exchange_rates');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las tasas de cambio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAllExchangeRates };