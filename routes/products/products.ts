import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import Product from '../../models/Product';
import AuthMiddleware from '../../middleware/auth';
import requireAdmin from '../../middleware/admin';

const createProductRouter = Router();

const checkProduct = z.object({
    title: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().min(3),
    price: z.number().min(0),
    stock: z.number().min(0),
    images: z.array(z.string().url()),
    category: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
        message: "Invalid ObjectId"
    }),
    isActive: z.boolean().optional()
});

createProductRouter.post('/products', AuthMiddleware, requireAdmin, async (req: Request, res: Response) => {
    try {
        const result = checkProduct.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const product = new Product(result.data);
        await product.save();

        return res.status(201).json({ message: "Product created", product });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }


});

export default createProductRouter;
