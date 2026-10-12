import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/index.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
      type: String,
      enum: ['ADMIN'],
      default: 'ADMIN',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash de contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);
