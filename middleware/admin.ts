import { type Request, type Response, type NextFunction } from 'express';

function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    next();
}


export default requireAdmin;
