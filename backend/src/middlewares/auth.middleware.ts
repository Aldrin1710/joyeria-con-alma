import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, JwtPayload } from '../types/index.js';

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Acceso no autorizado. Se requiere token de sesión.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado. Inicia sesión nuevamente.',
    });
  }
};
