import { Router, type Request, type Response } from 'express';
import Product from '../../models/Product';
import AuthMiddleware from '../../middleware/auth';
import requireAdmin from '../../middleware/admin';

const deleteProductRouter = Router();

deleteProductRouter.delete('/products/:id', AuthMiddleware, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default deleteProductRouter;
