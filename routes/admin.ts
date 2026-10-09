import { Router, type Request, type Response } from 'express';
import requireAdmin from '../middleware/admin';

const adminRouter = Router();

adminRouter.get("/admin", requireAdmin, (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to admin" });
});






