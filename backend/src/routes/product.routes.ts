import { Router } from 'express';
import {
  getPublicProducts,
  getSearchSuggestions,
  getProductById,
  getUniqueHashtags,
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', getPublicProducts);
router.get('/search-suggestions', getSearchSuggestions);
router.get('/hashtags', getUniqueHashtags);
router.get('/:id', getProductById);

export default router;
