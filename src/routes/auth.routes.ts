import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

/**
 * Zod schema for login credentials validation.
 * Structured so credentials can easily be replaced by a DB lookup.
 */
const loginSchema = z.object({
    username: z.string().min(1, 'El nombre de usuario es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Hardcoded credentials — replace with DB query in production.
 * The structure mirrors what a DB lookup would return.
 */
interface UserRecord {
    username: string;
    password: string;
    displayName: string;
}

const USERS: UserRecord[] = [
    { username: 'admin', password: 'Admin123!', displayName: 'Administrador' },
];

function findUser(username: string, password: string): UserRecord | undefined {
    return USERS.find(
        (user) => user.username === username && user.password === password
    );
}

/** GET /login — render login form */
router.get('/login', (_req: Request, res: Response) => {
    if (_req.session.isAuthenticated) {
        res.redirect('/upload');
        return;
    }
    res.render('login', { error: null });
});

/** POST /login — validate credentials and create session */
router.post('/login', (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        const errorMessage = result.error.errors.map((e) => e.message).join(', ');
        res.render('login', { error: errorMessage });
        return;
    }

    const { username, password } = result.data;
    const user = findUser(username, password);

    if (!user) {
        res.render('login', { error: 'Credenciales inválidas. Intente nuevamente.' });
        return;
    }

    req.session.isAuthenticated = true;
    req.session.username = user.displayName;
    res.redirect('/upload');
});

/** POST /logout — destroy session and redirect to login */
router.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
        }
        res.redirect('/login');
    });
});

export default router;
