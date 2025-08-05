import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts
} from '../controllers/productController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { uploadSingle, handleUploadError } from '../middleware/upload';

const router = Router();

// Protected routes - Farmers only (put specific routes before parameterized ones)
router.get('/farmer/my-products', 
  authenticateToken, 
  requireRole('FARMER'), 
  getFarmerProducts
);

router.post('/', 
  authenticateToken, 
  requireRole('FARMER'), 
  uploadSingle, 
  handleUploadError, 
  createProduct
);

router.put('/:id', 
  authenticateToken, 
  requireRole('FARMER'), 
  uploadSingle, 
  handleUploadError, 
  updateProduct
);

router.delete('/:id', 
  authenticateToken, 
  requireRole('FARMER'), 
  deleteProduct
);

// Public routes (put parameterized routes last)
router.get('/', getProducts);
router.get('/:id', getProduct);

export default router;