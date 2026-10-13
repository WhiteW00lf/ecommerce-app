import { Router, type Request, type Response } from 'express';
import Cart from '../../models/Cart';
import AuthMiddleware from '../../middleware/auth';

const deleteOneCartRouter = Router();

deleteOneCartRouter.delete('/cart/item/:productId', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.status(200).json({ message: 'Item deleted successfully',cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default deleteOneCartRouter;