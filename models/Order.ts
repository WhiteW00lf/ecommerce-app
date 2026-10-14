import { Schema, model } from 'mongoose';

const orderSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            _id: false,
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true, min: 0, validate: { validator: Number.isInteger, message: '{VALUE} is not a valid number' } },
            quantity: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: '{VALUE} is not a valid number' } }
        },

    ],

    total: { type: Number, required: true, min: 0, validate: { validator: Number.isInteger, message: '{VALUE} is not a valid number' } },

    shippingAddress: {
        name: { type: String, required: true, trim: true },
        line1: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
    },

    status: { type: String, enum: ['pending','paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentId: { type: String, trim: true },







},

    {
        timestamps: true
    }
);

orderSchema.index({ user: 1, createdAt: -1 });
export default model('Order', orderSchema);