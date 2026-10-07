import mongoose, { Schema, model, connect } from 'mongoose';

export default async function connectToDB() {
    try {
        await connect('mongodb://localhost:27017/ecommerceapp');

    } catch (err) {
        console.log("Error ocurred while connecting to the DB");
    }

    console.log("Connected to DB");
}