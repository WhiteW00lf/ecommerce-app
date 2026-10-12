import { Router, type Request, type Response } from 'express';
import Product from '../../models/Product';

const getProductsRouter = Router();

getProductsRouter.get('/products', async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ isActive: true }).populate('category', 'name slug');

        return res.status(200).json({ products });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default getProductsRouter;
