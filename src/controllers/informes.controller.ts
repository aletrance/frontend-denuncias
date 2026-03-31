import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

export const REPORTS_DIR = path.join(process.cwd(), 'download');

/**
 * Ensure the directory exists
 */
export const ensureReportsDirExists = () => {
    if (!fs.existsSync(REPORTS_DIR)) {
        fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }
};

/**
 * GET requests - List all files in the directory
 */
export const getInformes = async (req: Request, res: Response): Promise<void> => {
    try {
        ensureReportsDirExists();

        // Read all files in the directory asynchronously
        const files = await fs.promises.readdir(REPORTS_DIR);

        // Map files to include their Stats
        const fileInfoPromises = files.map(async (filename) => {
            const filePath = path.join(REPORTS_DIR, filename);
            const stats = await fs.promises.stat(filePath);

            return {
                name: filename,
                size: (stats.size / 1024).toFixed(2), // KB
                created: stats.birthtime,
                isDir: stats.isDirectory()
            };
        });

        // Resolve all stats and filter out directories
        let fileInfos = await Promise.all(fileInfoPromises);
        fileInfos = fileInfos.filter(f => !f.isDir);

        res.render('informes', {
            username: req.session.username,
            archivos: fileInfos,
            error: null
        });
    } catch (error) {
        console.error('Error fetching informes:', error);
        res.render('informes', {
            username: req.session.username,
            archivos: [],
            error: 'Error al leer la carpeta de informes listos.'
        });
    }
};

/**
 * Endpoint to download a specific file
 */
export const downloadInforme = (req: Request, res: Response): void => {
    try {
        const paramFilename = req.params.filename;
        const filename: string = Array.isArray(paramFilename) ? paramFilename[0] : paramFilename;
        const safeFilename = path.basename(filename); // Prevent directory traversal
        const filePath = path.join(REPORTS_DIR, safeFilename);

        if (!fs.existsSync(filePath)) {
            res.status(404).render('informes', {
                username: req.session.username,
                archivos: [],
                error: `Archivo ${safeFilename} no encontrado.`
            });
            return;
        }

        res.download(filePath, safeFilename);

    } catch (error) {
        console.error('Error downloading informe:', error);
        res.status(500).send('Error interno del servidor al procesar la descarga.');
    }
};

/**
 * Endpoint to open/view a file directly in the browser
 */
export const openInforme = (req: Request, res: Response): void => {
    try {
        const paramFilename = req.params.filename;
        const filename: string = Array.isArray(paramFilename) ? paramFilename[0] : paramFilename;
        const safeFilename = path.basename(filename);
        const filePath = path.join(REPORTS_DIR, safeFilename);

         if (!fs.existsSync(filePath)) {
            res.status(404).render('informes', {
                username: req.session.username,
                archivos: [],
                error: `Archivo ${safeFilename} no encontrado.`
            });
            return;
        }

        res.sendFile(filePath);

    } catch (error) {
        console.error('Error opening informe:', error);
        res.status(500).send('Error interno del servidor al procesar el archivo.');
    }
};
