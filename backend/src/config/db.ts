import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('[Database] Utilizando conexión existente a MongoDB.');
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    isConnected = !!conn.connections[0].readyState;
    console.log(`[Database] MongoDB conectado exitosamente: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[Database] Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Desconectado de MongoDB.');
  isConnected = false;
});
