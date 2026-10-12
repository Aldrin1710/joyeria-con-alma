import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app: Application = express();

// CORS configurado para permitir cookies desde el frontend
app.use(
  cors({
    origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Endpoint de verificación de estado (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// Enrutador principal
app.use('/api', apiRouter);

// Manejador de rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Middleware global de errores
app.use(errorHandler);

export default app;
