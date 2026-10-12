import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error Handler]', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: messages,
    });
    return;
  }

  // Error de ID inválido de MongoDB (CastError)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Formato de identificador inválido: ${err.value}`,
    });
    return;
  }

  // Clave duplicada en MongoDB (ej. username)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    res.status(409).json({
      success: false,
      message: `El ${field} ya existe y no puede duplicarse.`,
    });
    return;
  }

  // Error de Multer (archivo grande o formato inválido)
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'El archivo excede el tamaño máximo permitido de 5MB.',
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `Error al procesar archivo: ${err.message}`,
    });
    return;
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor.',
  });
};
