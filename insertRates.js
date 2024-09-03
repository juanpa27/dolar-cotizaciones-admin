import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

dotenv.config();
console.log('Database URL:', process.env.POSTGRES_URL);
async function insertExchangeRates() {
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
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (provider) 
        DO UPDATE SET compra = EXCLUDED.compra, referencial_diario = EXCLUDED.referencial_diario, 
                      venta = EXCLUDED.venta, updated = EXCLUDED.updated`,
        [provider, compra, referencial_diario, venta, updated]
      );
    }

    console.log('Datos insertados/actualizados correctamente');
  } catch (error) {
    console.error('Error al insertar los datos:', error);
  } finally {
    await client.end();
  }
}

insertExchangeRates();
