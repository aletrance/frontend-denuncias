import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { getInformes, downloadInforme, openInforme } from '../controllers/informes.controller';

const router = Router();

// GET list of reports
router.get('/informes', requireAuth, getInformes);

// GET download a specific report
router.get('/informes/descargar/:filename', requireAuth, downloadInforme);

// GET open/view a specific report
router.get('/informes/abrir/:filename', requireAuth, openInforme);

export default router;
