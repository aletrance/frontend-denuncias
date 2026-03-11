import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that protects routes requiring authentication.
 * Redirects unauthenticated users to /login.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session.isAuthenticated) {
        next();
        return;
    }
    res.redirect('/login');
}
