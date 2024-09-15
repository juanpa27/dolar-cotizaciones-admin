const { Pool } = require('pg');
require('dotenv').config(); // Carga las variables de entorno
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,  
  },
});
module.exports = pool;