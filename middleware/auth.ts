import { type Request, type Response, type NextFunction } from 'express';
import JsonwebToken from 'jsonwebtoken';

function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Token does not exist" });
    }

    try {
        const decoded = JsonwebToken.verify(token, process.env.SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}






export default AuthMiddleware;