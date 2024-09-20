import pool from '../models/db.js';

export const getAllExchangeRates = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        provider, 
        compra, 
        venta, 
        referencial_diario, 
        updated::date AS updated
      FROM public.exchange_rates AS er
      WHERE updated >= (current_date - interval '7 days')
      AND (updated, provider) IN (
        SELECT MAX(updated), provider
        FROM public.exchange_rates
        WHERE updated >= (current_date - interval '7 days')
        GROUP BY provider, updated::date
      )
      ORDER BY updated DESC
    `);
    

    const groupedData = result.rows.reduce((acc, row) => {
      const { provider, compra, venta,referencial_diario, updated } = row;
      
    
      if (!acc[provider]) {
        acc[provider] = [];
      }
    
      acc[provider].push({
        compra,
        venta,
        referencial_diario,
        fecha: updated
      });

      return acc;
    }, {});

    
    res.status(200).json(groupedData);
  } catch (error) {
    console.error('Error al obtener las tasas de cambio:', error.message || error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message || 'Detalles no disponibles' });
  }
};
