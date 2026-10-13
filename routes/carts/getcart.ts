import { Router, type Request, type Response } from 'express';
import Cart from '../../models/Cart';
import AuthMiddleware from '../../middleware/auth';

const getCartRouter = Router();

getCartRouter.get('/cart', AuthMiddleware, async (req: Request, res: Response) => {


try{
    const getcart = await Cart.findOne({ user: req.user.userId })
        .populate('items.product','title price images stock isActive');

    const items = (getcart?.items? getcart.items : [])
    .filter(item => item.product && item.product.isActive)
    .map(item => ({
        product: item.product,
        quantity: item.quantity,
        lineTotal: item.quantity * item.product.price
    }));
    const cartTotal = items.reduce((total, item) => total + item.lineTotal, 0); 

    return res.status(200).json({ items, cartTotal });
} catch (error) {
    return res.status(500).json({ error: 'Internal server error', error: error.message });  
}






});

export default getCartRouter;