import { Router } from 'express';
import { getActiveSlides } from '../controllers/carousel.controller.js';

const router = Router();

router.get('/', getActiveSlides);

export default router;
