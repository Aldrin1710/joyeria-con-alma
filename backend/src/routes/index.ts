import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import carouselRoutes from './carousel.routes.js';
import adminRoutes from './admin.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/productos', productRoutes);
apiRouter.use('/carrusel', carouselRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
