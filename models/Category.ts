import mongoose, { Schema, model } from 'mongoose';

const categorySchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },








}, { timestamps: true });



const Category = mongoose.model('Category', categorySchema);
export default Category
