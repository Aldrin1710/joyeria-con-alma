import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, JwtPayload } from '../types/index.js';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Debes proporcionar usuario y contraseña.',
      });
      return;
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
      return;
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      username: user.username,
      rol: user.rol,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '2h',
    });

    const isProduction = ENV.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 2 * 60 * 60 * 1000, // 2 horas de inactividad
    });

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: {
        id: user._id,
        username: user.username,
        rol: user.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente.',
  });
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autenticado.' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
