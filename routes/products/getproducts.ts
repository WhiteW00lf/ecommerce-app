import { Router, type Request, type Response } from 'express';
import Product from '../../models/Product';
import { z } from 'zod';

const getProductsRouter = Router();
const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(10)
});

getProductsRouter.get('/products', async (req: Request, res: Response) => {
    const queryResult = listQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
        return res.status(400).json({ error: queryResult.error.issues });
    }
    const { page, limit } = queryResult.data;
    const filter = { isActive: true };


    try {
        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('category', 'name slug')
                .skip((page - 1) * limit)
                .limit(limit),
            Product.countDocuments(filter)



        ]);

        return res.status(200).json({ products, total, page, limit, TotalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default getProductsRouter;
