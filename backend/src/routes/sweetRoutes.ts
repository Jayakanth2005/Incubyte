import { Router } from 'express';
import { SweetController, sweetValidation } from '../controllers/sweetController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public (authenticated) routes
router.get('/', SweetController.getAll);
router.get('/search', sweetValidation.search, validate, SweetController.search);
router.get('/:id', SweetController.getById);
router.post('/:id/purchase', sweetValidation.purchase, validate, SweetController.purchase);

// Admin only routes
router.post('/', requireAdmin, sweetValidation.create, validate, SweetController.create);
router.put('/:id', requireAdmin, sweetValidation.update, validate, SweetController.update);
router.delete('/:id', requireAdmin, SweetController.delete);
router.post('/:id/restock', requireAdmin, sweetValidation.restock, validate, SweetController.restock);

export default router;
