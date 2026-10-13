import { Router, type Request, type Response } from 'express';
import Cart from '../../models/Cart';
import AuthMiddleware from '../../middleware/auth';

const deleteCartRouter = Router();

deleteCartRouter.delete('/cart', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        
        await Cart.deleteOne({ user: req.user.userId });
        return res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default deleteCartRouter;