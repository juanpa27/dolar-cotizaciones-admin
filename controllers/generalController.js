import pool from "../models/db.js";

// Obtener todas las tasas de cambio (últimos 7 días)
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
      const { provider, compra, venta, referencial_diario, updated } = row;

      if (!acc[provider]) {
        acc[provider] = [];
      }

      acc[provider].push({
        compra,
        venta,
        referencial_diario,
        fecha: updated,
      });

      return acc;
    }, {});

    res.status(200).json(groupedData);
  } catch (error) {
    console.error(
      "Error al obtener las tasas de cambio:",
      error.message || error
    );
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message || "Detalles no disponibles",
    });
  }
};

// Obtener tasas de cambio por proveedor
export const getExchangeRatesByProvider = async (req, res) => {
  const { provider } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        provider, 
        compra, 
        venta, 
        referencial_diario, 
        updated::date AS updated
      FROM public.exchange_rates
      WHERE provider = $1
      ORDER BY updated DESC;
      `,
      [provider]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({
          error: "No se encontraron datos para el proveedor especificado",
        });
    }

    const data = result.rows.map((row) => ({
      compra: row.compra,
      venta: row.venta,
      referencial_diario: row.referencial_diario,
      fecha: row.updated,
    }));

    res.status(200).json({ provider, data });
  } catch (error) {
    console.error(
      "Error al obtener las tasas de cambio por proveedor:",
      error.message || error
    );
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message || "Detalles no disponibles",
    });
  }
};

// Obtener tasas de cambio por fecha específica
export const getExchangeRatesByDate = async (req, res) => {
  const { date } = req.params;

  // Validar formato de fecha (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res
      .status(400)
      .json({ error: "Formato de fecha inválido. Debe ser YYYY-MM-DD" });
  }

  try {
    const result = await pool.query(
      `
    SELECT DISTINCT ON (provider) 
      provider, 
      compra, 
      venta, 
      referencial_diario, 
      updated::date AS updated
    FROM public.exchange_rates
    WHERE updated::date = $1
    ORDER BY provider, updated DESC;
      `,
      [date]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron datos para la fecha especificada" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(
      "Error al obtener las tasas de cambio por fecha:",
      error.message || error
    );
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message || "Detalles no disponibles",
    });
  }
};
