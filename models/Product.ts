import mongoose, { Schema, model } from 'mongoose';

const productSchema = new Schema(

   {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true},
    price: { type: Number, required: true, min: 0, validate:{validator: Number.isInteger, message: "Price must be an integer"} }, 
    stock: { type: Number, required: true, min: 0, default: 0, validate: { validator: Number.isInteger, message: "Stock must be an integer" } },
    images: [{ type: String, trim: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }

   


);

productSchema.index({ category: 1 });


const Product = mongoose.model('Product',productSchema );


export default Product;