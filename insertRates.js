import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

dotenv.config();

export async function insertExchangeRates() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();

  try {
    const response = await fetch('https://dolar.melizeche.com/api/1.0/');
    const data = await response.json();
    const rates = data.dolarpy;
    const updated = data.updated;

    for (const [provider, values] of Object.entries(rates)) {
      const { compra, referencial_diario, venta } = values;

      await client.query(
        `INSERT INTO exchange_rates (provider, compra, referencial_diario, venta, updated) 
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (provider, updated) DO NOTHING`,
        [provider, compra, referencial_diario, venta]
      );
    }

    console.log('Datos insertados/actualizados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    await client.end();
  }
}