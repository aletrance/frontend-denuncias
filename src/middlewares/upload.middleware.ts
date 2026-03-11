import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
    destination(_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, UPLOADS_DIR);
    },
    filename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, sanitizedName);
    },
});

/**
 * File filter that only accepts PDF files (MIME type application/pdf).
 */
function pdfFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF (.pdf)'));
    }
}

const upload = multer({
    storage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});

/** Middleware for single PDF file upload (field name: "pdfFile") */
export const uploadSinglePdf = upload.single('pdfFile');
