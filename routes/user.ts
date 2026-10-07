import express, { Router, type Request, type Response } from 'express';
import User from '../models/User';

const createUserRouter = Router();

createUserRouter.post("/users", async (req: Request, res: Response) => {


    try {

        const { name,email, password } = req.body;

        const newUser = new User({
            email: email,
            name: name,
            password: password
        });

        await newUser.save();

        return res.status(201).json({ message: newUser });

    } catch (err) {
        console.log(err);
        return res.status(400).json({error: err});
    }











});

export default createUserRouter;