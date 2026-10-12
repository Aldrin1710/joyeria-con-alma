import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 intentos por IP
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
