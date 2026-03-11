import { SessionOptions } from 'express-session';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
const SESSION_MAX_AGE = 30 * 60 * 1000; // 30 minutes

export const sessionOptions: SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // Solo activar 'secure' si hay HTTPS (ej. detrás de un reverse proxy)
        // Usar COOKIE_SECURE=true cuando se tenga HTTPS configurado
        secure: process.env.COOKIE_SECURE === 'true',
        maxAge: SESSION_MAX_AGE,
        sameSite: 'lax',
    },
};
