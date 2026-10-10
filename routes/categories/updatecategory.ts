import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import Category from '../../models/Category';
import AuthMiddleware from '../../middleware/auth';
import requireAdmin from '../../middleware/admin';

const updateCategoryRouter = Router();

const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional()
});

updateCategoryRouter.put('/categories/:id', AuthMiddleware, requireAdmin, async (req: Request, res: Response) => {
    try {
        const result = updateCategorySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            result.data,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Category updated", category: updated });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default updateCategoryRouter;
