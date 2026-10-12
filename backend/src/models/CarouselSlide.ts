import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICarouselSlide } from '../types/index.js';

export interface ICarouselSlideDocument extends Omit<ICarouselSlide, '_id'>, Document {}

const CarouselSlideSchema = new Schema<ICarouselSlideDocument>(
  {
    titulo: {
      type: String,
      required: [true, 'El título del slide es obligatorio'],
      trim: true,
    },
    subtitulo: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'La URL de la imagen es obligatoria'],
    },
    targetUrl: {
      type: String,
      default: '',
      trim: true,
    },
    orden: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CarouselSlide: Model<ICarouselSlideDocument> = mongoose.model<ICarouselSlideDocument>(
  'CarouselSlide',
  CarouselSlideSchema
);
