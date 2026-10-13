import  { Router ,type Request, type Response } from 'express';
import Cart from '../../models/Cart';
import Product from '../../models/Product';
import {z} from 'zod';
import AuthMiddleware from '../../middleware/auth';

const cartRouter = Router();



cartRouter.post('/cart/items',AuthMiddleware, async (req: Request, res: Response) => {

    const cartCheck = z.object({
        product_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
        quantity: z.number().min(1).max(100)
    });

    const result = cartCheck.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.message });
    }

    const { product_id, quantity } = result.data;
    console.log(req.user);
    try {
        const product = await Product.findOne({ _id: product_id,  isActive: true });
        if(!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.userId });
        if(!cart) {
            cart = new Cart({ user: req.user.userId, items: [] });
        }

        const existing = cart.items.find(item => item.product.toString() === product_id);
        if(existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ product: product_id, quantity });
        }

        await cart.save();
        return res.status(200).json(cart);


    }catch (error) {
        return res.status(500).json({ error: 'Internal server error' , error: error.message });
    }


});






export default cartRouter;