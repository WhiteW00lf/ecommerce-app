import { Router, type Request, type Response } from 'express';
import Cart from '../../models/Cart';
import Product from '../../models/Product';
import AuthMiddleware from '../../middleware/auth';
import { z } from 'zod';

const updateCartRouter = Router();

updateCartRouter.put('/cart/items/:productId', AuthMiddleware, async (req: Request, res: Response) => {


    const { productId } = req.params;
    const { quantity } = req.body;

    const quantitySchema = z.number().int().min(1);
    const parseResult = quantitySchema.safeParse(quantity);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {

        const cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const line = cart.items.find(item => item.product.toString() === productId);
        if (!line) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        const product = await Product.findOne({ _id: productId, isActive: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found or inactive' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ error: 'Quantity exceeds available stock' });
        }


        line.quantity = quantity;
        await cart.save();




        return res.status(200).json({ message: 'Cart updated successfully', cart });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default updateCartRouter;