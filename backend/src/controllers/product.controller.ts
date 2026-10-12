import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';

export const getPublicProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 15);
    const hashtag = typeof req.query.hashtag === 'string' ? req.query.hashtag.trim() : null;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : null;

    // Filtro base: no eliminados y no borradores
    const query: Record<string, any> = {
      deletedAt: null,
      estado: { $ne: 'BORRADOR' },
    };

    if (hashtag && hashtag !== 'Todos') {
      const normalizedTag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
      query.hashtags = { $regex: new RegExp(`^${normalizedTag}$`, 'i') };
    }

    if (search) {
      query.nombre = { $regex: search, $options: 'i' };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (!q || q.length < 2) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const suggestions = await Product.find({
      deletedAt: null,
      estado: { $ne: 'BORRADOR' },
      nombre: { $regex: q, $options: 'i' },
    })
      .select('_id nombre imagenes precioBase estado')
      .limit(5);

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Joya no encontrada o no disponible.',
      });
      return;
    }

    // Buscar productos relacionados por hashtags coincidentes (RF6)
    let related: any[] = [];
    if (product.hashtags && product.hashtags.length > 0) {
      related = await Product.find({
        _id: { $ne: product._id },
        deletedAt: null,
        estado: { $ne: 'BORRADOR' },
        hashtags: { $in: product.hashtags },
      })
        .limit(4)
        .select('_id nombre imagenes precioBase estado hashtags');
    }

    res.status(200).json({
      success: true,
      data: product,
      related,
    });
  } catch (error) {
    next(error);
  }
};

export const getUniqueHashtags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tags = await Product.distinct('hashtags', {
      deletedAt: null,
      estado: { $ne: 'BORRADOR' },
    });

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};
