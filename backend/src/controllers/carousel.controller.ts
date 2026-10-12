import { Request, Response, NextFunction } from 'express';
import { CarouselSlide } from '../models/CarouselSlide.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

export const getActiveSlides = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slides = await CarouselSlide.find({ isActive: true }).sort({ orden: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSlidesAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slides = await CarouselSlide.find().sort({ orden: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    next(error);
  }
};

export const createSlide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { titulo, subtitulo, targetUrl, orden, isActive } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'joyeria_con_alma/carrusel');
      imageUrl = uploadRes.url;
    }

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        message: 'Debes proporcionar una imagen para el slide.',
      });
      return;
    }

    const slide = await CarouselSlide.create({
      titulo,
      subtitulo: subtitulo || '',
      imageUrl,
      targetUrl: targetUrl || '',
      orden: orden ? parseInt(orden, 10) : 0,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
    });

    res.status(201).json({
      success: true,
      message: 'Slide creado exitosamente.',
      data: slide,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, subtitulo, targetUrl, orden, isActive } = req.body;

    const slide = await CarouselSlide.findById(id);
    if (!slide) {
      res.status(404).json({ success: false, message: 'Slide no encontrado.' });
      return;
    }

    if (req.file) {
      // Destruir imagen anterior si existe en Cloudinary
      if (slide.imageUrl) {
        await deleteFromCloudinary(slide.imageUrl);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'joyeria_con_alma/carrusel');
      slide.imageUrl = uploadRes.url;
    }

    if (titulo !== undefined) slide.titulo = titulo;
    if (subtitulo !== undefined) slide.subtitulo = subtitulo;
    if (targetUrl !== undefined) slide.targetUrl = targetUrl;
    if (orden !== undefined) slide.orden = parseInt(orden, 10);
    if (isActive !== undefined) slide.isActive = isActive === 'true' || isActive === true;

    await slide.save();

    res.status(200).json({
      success: true,
      message: 'Slide actualizado exitosamente.',
      data: slide,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const slide = await CarouselSlide.findById(id);
    if (!slide) {
      res.status(404).json({ success: false, message: 'Slide no encontrado.' });
      return;
    }

    if (slide.imageUrl) {
      await deleteFromCloudinary(slide.imageUrl);
    }

    await slide.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Slide eliminado permanentemente.',
    });
  } catch (error) {
    next(error);
  }
};
