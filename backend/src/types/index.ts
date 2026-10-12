import { Request } from 'express';

export type ProductStatus = 'EN_STOCK' | 'BAJO_ENCARGO' | 'AGOTADO' | 'BORRADOR';

export interface IProductDetail {
  clave: string;
  valor: string;
}

export interface IProduct {
  _id?: string;
  nombre: string;
  descripcion: string;
  precioBase?: number | null;
  imagenes: string[];
  detalles: IProductDetail[];
  hashtags: string[];
  estado: ProductStatus;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  username: string;
  passwordHash: string;
  rol: 'ADMIN';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICarouselSlide {
  _id?: string;
  titulo: string;
  subtitulo: string;
  imageUrl: string;
  targetUrl?: string;
  orden: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JwtPayload {
  userId: string;
  username: string;
  rol: 'ADMIN';
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
