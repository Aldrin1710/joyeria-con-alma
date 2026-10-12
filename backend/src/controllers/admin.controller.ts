import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

export const getAllProductsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 20);
    const estado = typeof req.query.estado === 'string' ? req.query.estado : null;
    const isTrash = req.query.isTrash === 'true';

    const query: Record<string, any> = {};

    if (isTrash) {
      query.deletedAt = { $ne: null };
    } else {
      query.deletedAt = null;
      if (estado) {
        query.estado = estado;
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ updatedAt: -1 })
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

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, descripcion, precioBase, estado } = req.body;

    let detalles = [];
    if (req.body.detalles) {
      detalles = typeof req.body.detalles === 'string' ? JSON.parse(req.body.detalles) : req.body.detalles;
    }

    let hashtags: string[] = [];
    if (req.body.hashtags) {
      hashtags = Array.isArray(req.body.hashtags)
        ? req.body.hashtags
        : typeof req.body.hashtags === 'string'
        ? req.body.hashtags.split(',').map((t: string) => t.trim())
        : [];
    }

    // Normalizar hashtags para que comiencen con #
    hashtags = hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

    const imageUrls: string[] = [];

    // Subir imágenes si se enviaron archivos
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadRes = await uploadBufferToCloudinary(file.buffer, 'joyeria_con_alma/productos');
        imageUrls.push(uploadRes.url);
      }
    }

    // O aceptar imágenes preexistentes si se envían URLs
    if (req.body.imagenes) {
      const existingUrls = Array.isArray(req.body.imagenes) ? req.body.imagenes : [req.body.imagenes];
      imageUrls.push(...existingUrls);
    }

    const newProduct = await Product.create({
      nombre,
      descripcion,
      precioBase: precioBase ? parseFloat(precioBase) : null,
      imagenes: imageUrls,
      detalles,
      hashtags,
      estado: estado || 'BORRADOR',
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precioBase, estado } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }

    if (nombre !== undefined) product.nombre = nombre;
    if (descripcion !== undefined) product.descripcion = descripcion;
    if (precioBase !== undefined) product.precioBase = precioBase ? parseFloat(precioBase) : null;
    if (estado !== undefined) product.estado = estado;

    if (req.body.detalles !== undefined) {
      product.detalles =
        typeof req.body.detalles === 'string' ? JSON.parse(req.body.detalles) : req.body.detalles;
    }

    if (req.body.hashtags !== undefined) {
      let hashtags = Array.isArray(req.body.hashtags)
        ? req.body.hashtags
        : typeof req.body.hashtags === 'string'
        ? req.body.hashtags.split(',').map((t: string) => t.trim())
        : [];
      product.hashtags = hashtags.map((t: string) => (t.startsWith('#') ? t : `#${t}`));
    }

    // Manejar eliminación de imágenes específicas
    if (req.body.deletedImageUrls) {
      const urlsToDelete = Array.isArray(req.body.deletedImageUrls)
        ? req.body.deletedImageUrls
        : [req.body.deletedImageUrls];

      for (const url of urlsToDelete) {
        await deleteFromCloudinary(url);
        product.imagenes = product.imagenes.filter((img) => img !== url);
      }
    }

    // Subir nuevas imágenes si se enviaron
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadRes = await uploadBufferToCloudinary(file.buffer, 'joyeria_con_alma/productos');
        product.imagenes.push(uploadRes.url);
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }

    product.deletedAt = new Date();
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Producto enviado a la papelera. Se purgará automáticamente en 15 días.',
    });
  } catch (error) {
    next(error);
  }
};

export const restoreProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }

    product.deletedAt = null;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Producto restaurado exitosamente de la papelera.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const emptyTrash = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trashedProducts = await Product.find({ deletedAt: { $ne: null } });

    // Destruir todas las imágenes en Cloudinary (RF3)
    for (const prod of trashedProducts) {
      for (const imgUrl of prod.imagenes) {
        await deleteFromCloudinary(imgUrl);
      }
    }

    const deleteResult = await Product.deleteMany({ deletedAt: { $ne: null } });

    res.status(200).json({
      success: true,
      message: `Papelera vaciada exitosamente. Se eliminaron permanentemente ${deleteResult.deletedCount} productos y sus imágenes.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const permanentDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }

    // Destruir imágenes en Cloudinary
    for (const imgUrl of product.imagenes) {
      await deleteFromCloudinary(imgUrl);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Producto eliminado permanentemente junto con sus imágenes.',
    });
  } catch (error) {
    next(error);
  }
};
