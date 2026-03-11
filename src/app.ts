import './types/session';
import express from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import { sessionOptions } from './config/session.config';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// View engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/', authRoutes);
app.use('/', uploadRoutes);

// Root redirect
app.get('/', (_req, res) => {
    res.redirect('/login');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📁 Archivos PDF se guardan en: ${uploadsDir}`);
});

export default app;
