import mongoose, { Schema, model } from 'mongoose';
import connecToDB from '../initDB';
import { email, minLength, string } from 'zod';
import { required } from 'zod/mini';

connecToDB();

const userSchema = new Schema({
    name: {
        type: string,
        required: true,
        minLength: 1

    },

    email: {
        type: string,
        required: true,
        minLength: 8,
    },
    password: {
        type: string,
        required: true,
        minLength: 8
    }
});



const User = mongoose.model('User', userSchema);