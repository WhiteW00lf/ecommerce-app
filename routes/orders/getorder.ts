import {Router, type Request, type Response} from 'express';
import Order from '../../models/Order';
import AuthMiddleware from '../../middleware/auth';
import { z } from 'zod';

const getOrderRouter = Router();


const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});


getOrderRouter.get('/orders',AuthMiddleware, async (req: Request, res: Response) => {

    try {

        const { page, limit } = listQuerySchema.parse(req.query);
        const total = await Order.countDocuments({'user': req.user.userId});
        const orders = await Order.find({'user': req.user.userId})
                                  .sort({'createdAt': -1})
                                  .skip((page - 1) * limit)
                                  .limit(limit);
        res.status(200).json({
             orders,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }


});

export default getOrderRouter;