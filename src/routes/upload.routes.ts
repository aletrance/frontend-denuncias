import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { uploadSinglePdf } from '../middlewares/upload.middleware';
import multer from 'multer';

const router = Router();

/** GET /upload — render upload form (protected) */
router.get('/upload', requireAuth, (req: Request, res: Response) => {
    res.render('upload', {
        username: req.session.username,
        error: null,
    });
});

/** POST /upload — handle PDF file upload (protected) */
router.post('/upload', requireAuth, (req: Request, res: Response, next: NextFunction) => {
    uploadSinglePdf(req, res, (err: unknown) => {
        if (err) {
            let errorMessage = 'Error al subir el archivo.';

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'El archivo excede el tamaño máximo permitido (10 MB).';
                } else {
                    errorMessage = `Error de carga: ${err.message}`;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            res.render('upload', {
                username: req.session.username,
                error: errorMessage,
            });
            return;
        }

        if (!req.file) {
            res.render('upload', {
                username: req.session.username,
                error: 'Debe seleccionar un archivo PDF para subir.',
            });
            return;
        }

        const fileSizeKb = (req.file.size / 1024).toFixed(2);

        res.render('success', {
            username: req.session.username,
            fileName: req.file.originalname,
            fileSize: `${fileSizeKb} KB`,
            savedAs: req.file.filename,
        });
    });
});

export default router;
