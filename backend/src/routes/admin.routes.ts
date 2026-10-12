import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { uploadImages, uploadSingleImage } from '../middlewares/upload.middleware.js';
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  permanentDeleteProduct,
  emptyTrash,
} from '../controllers/admin.controller.js';
import {
  getAllSlidesAdmin,
  createSlide,
  updateSlide,
  deleteSlide,
} from '../controllers/carousel.controller.js';

const router = Router();

// Todas las rutas de administración requieren token JWT
router.use(verifyToken);

// --- GESTIÓN DE PRODUCTOS ---
router.get('/productos', getAllProductsAdmin);
router.post('/productos', uploadImages.array('imagenes', 5), createProduct);
router.put('/productos/:id', uploadImages.array('imagenes', 5), updateProduct);
router.delete('/productos/:id', softDeleteProduct); // Mover a la papelera
router.patch('/productos/:id/restore', restoreProduct); // Restaurar de la papelera
router.delete('/productos/:id/permanent', permanentDeleteProduct); // Eliminación permanente
router.delete('/papelera', emptyTrash); // Vaciar papelera completa

// --- GESTIÓN DE SLIDES (HERO) ---
router.get('/slides', getAllSlidesAdmin);
router.post('/slides', uploadSingleImage.single('imagen'), createSlide);
router.put('/slides/:id', uploadSingleImage.single('imagen'), updateSlide);
router.delete('/slides/:id', deleteSlide);

export default router;
