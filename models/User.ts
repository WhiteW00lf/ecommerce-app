import mongoose, { Schema, model } from 'mongoose';
import connecToDB from '../initDB';

connecToDB();

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1

    },

    email: {
        type: String,
        required: true,
        minLength: 8,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
});



const User = mongoose.model('User', userSchema);
export default User;
