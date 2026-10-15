import {Router, type Request, type Response} from 'express';
import Order from '../../models/Order';
import AuthMiddleware from '../../middleware/auth';


const getSingleOrderRouter = Router();

getSingleOrderRouter.get('/order/:id', AuthMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid order id' });
    }

    try {
        // Replace this with your actual order fetching logic
        const order = await Order.findOne({'_id': id, 'user': req.user.userId});
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default getSingleOrderRouter;


