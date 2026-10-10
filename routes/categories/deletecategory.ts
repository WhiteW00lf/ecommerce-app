import { Router, type Request, type Response } from 'express';
import Category from '../../models/Category';
import AuthMiddleware from '../../middleware/auth';
import requireAdmin from '../../middleware/admin';

const deleteCategoryRouter = Router();

deleteCategoryRouter.delete('/categories/:id', AuthMiddleware, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Category deleted" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default deleteCategoryRouter;
