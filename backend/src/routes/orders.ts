import { Router } from 'express';
import {
  createOrder,
  getCustomerOrders,
  getFarmerOrders,
  getOrder,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Protected routes - specific paths first
router.get('/customer/my-orders', authenticateToken, requireRole('CUSTOMER'), getCustomerOrders);
router.get('/farmer/my-orders', authenticateToken, requireRole('FARMER'), getFarmerOrders);

// Protected routes - parameterized paths last
router.post('/', authenticateToken, requireRole('CUSTOMER'), createOrder);
router.get('/:id', authenticateToken, getOrder);
router.put('/:id/status', authenticateToken, requireRole('FARMER'), updateOrderStatus);

export default router;