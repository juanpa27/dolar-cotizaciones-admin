import express from 'express';
import cors from 'cors'; 
import generalRoutes from '../routes/general.js'; 
// Inicializa express
const app = express();

// Habilitar CORS y JSON
app.use(cors()); 
app.use(express.json()); 

// Definir las rutas
app.use('/api/exchange-rates', generalRoutes); 

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


const PORT = process.env.PORT || 3000; // Usar el puerto 3000 si no se especifica otro

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
// Exportar la app para Vercel usando export default
export default app;