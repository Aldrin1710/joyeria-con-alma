import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Servidor ejecutándose en: http://localhost:${ENV.PORT}`);
      console.log(`📡 Ambiente: ${ENV.NODE_ENV}`);
      console.log(`🔗 Frontend autorizado: ${ENV.FRONTEND_URL}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
    process.exit(1);
  }
};

startServer();
