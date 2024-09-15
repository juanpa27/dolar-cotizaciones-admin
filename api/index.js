const express = require('express');
const app = express();
const cors = require('cors');

// Habilitar CORS y JSON
app.use(cors());
app.use(express.json());

// Importar las rutas
const generalRoutes = require('../routes/general');


// Definir las rutas
app.use('/api/exchange-rates', generalRoutes);


// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Exportar la app para Vercel
module.exports = app;