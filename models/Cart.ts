import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true , unique: true },
    items:[
        {
            _id: false,
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],

   
},


 {timestamps:  true });


const Cart = model('Cart', cartSchema);

export default Cart;