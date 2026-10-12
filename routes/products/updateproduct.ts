import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import Product from '../../models/Product';
import AuthMiddleware from '../../middleware/auth';
import requireAdmin from '../../middleware/admin';

const updateProductRouter = Router();

const updateProductSchema = z.object({
    title: z.string().min(3).optional(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    description: z.string().min(3).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    category: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
        message: "Invalid ObjectId"
    }).optional(),
    isActive: z.boolean().optional()
});

updateProductRouter.put('/products/:id', AuthMiddleware, requireAdmin, async (req: Request, res: Response) => {
    try {
        const result = updateProductSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            result.data,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product updated", product: updated });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default updateProductRouter;
