import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { getDenuncias, updateDenuncia } from '../controllers/denuncias.controller';

const router = Router();

// GET all denuncias
router.get('/denuncias', requireAuth, getDenuncias);

// PATCH specific denuncia
router.patch('/denuncias/:id', requireAuth, updateDenuncia);

export default router;
