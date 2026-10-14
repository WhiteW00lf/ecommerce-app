import {Router, type Request, type Response } from 'express';
import Authmiddleware from '../../middleware/auth';
import { z } from 'zod';
import Cart from '../../models/Cart';
import Product from '../../models/Product';
import Order from '../../models/Order';
import mongoose from 'mongoose';

const createOrderRouter = Router();

class OrderError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

const orderSchema = z.object({

    shippingAddress: z.object({
        name: z.string().trim().min(1),
        line1: z.string().trim().min(1),
        city: z.string().trim().min(1),
        state: z.string().trim().min(1),
        pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
        phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    }),

})


createOrderRouter.post('/orders',Authmiddleware, async (req: Request, res: Response) => {

    const result = orderSchema.safeParse(req.body);
    if (!result.success) {
       return res.status(400).json({ error: 'Invalid order data', details: result.error.issues });
    }

    const {shippingAddress} = result.data;

    // start session 

    const session = await mongoose.startSession();
    try{
        let order;
        await session.withTransaction(async () => {
            // Create the order here
           const cart = await Cart.findOne({ user: req.user.userId }).session(session);
           if(!cart || cart.items.length === 0) {
               throw new OrderError('Cart is empty', 400);
           }

           let lines = []
           let total = 0;
           for(const item of cart.items) {
            const product = await Product.findOneAndUpdate(
                { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );
            if(!product) {
                throw new OrderError(`Product ${item.product} is not available in sufficient quantity`, 400);
            }
            lines.push({
                title: product.title,
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
            total += product.price * item.quantity;
           }

           const [created] = await Order.create(
            [{
                user: req.user.userId,
                shippingAddress,
                items: lines,
                total
            }],
            { session }
           );
           await Cart.deleteOne({ user: req.user.userId }).session(session);
           order = created;
        });

         return res.status(201).json({ order });

    } catch (error) {
        if (error instanceof OrderError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
       await session.endSession();
    }

   





});

export default createOrderRouter;