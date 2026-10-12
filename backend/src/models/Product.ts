import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct, ProductStatus } from '../types/index.js';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const DetailSchema = new Schema(
  {
    clave: {
      type: String,
      required: true,
      trim: true,
    },
    valor: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      index: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    precioBase: {
      type: Number,
      min: [0, 'El precio base no puede ser negativo'],
      default: null,
    },
    imagenes: {
      type: [String],
      default: [],
    },
    detalles: {
      type: [DetailSchema],
      default: [],
    },
    hashtags: {
      type: [String],
      default: [],
      index: true,
    },
    estado: {
      type: String,
      enum: ['EN_STOCK', 'BAJO_ENCARGO', 'AGOTADO', 'BORRADOR'],
      default: 'BORRADOR',
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index: Los productos con `deletedAt` se eliminan automáticamente tras 15 días (15 * 86400 = 1296000 seg)
ProductSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 });

// Índice de texto para búsqueda de alta velocidad
ProductSchema.index({ nombre: 'text', descripcion: 'text' });

export const Product: Model<IProductDocument> = mongoose.model<IProductDocument>('Product', ProductSchema);
