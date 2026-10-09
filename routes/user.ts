import express, { Router, type Request, type Response } from 'express';
import User from '../models/User';
import * as z from 'zod';
import generateHash from '../hasher';

const createUserRouter = Router();

createUserRouter.post("/users", async (req: Request, res: Response) => {


    try {

        const { name, email, password } = req.body;

        const CheckUser = z.object({
            name: z.string().min(2),
            email: z.email(),
            password: z.string().min(8)



        });

        const result = CheckUser.safeParse(req.body);

        if (result.error) {
            return res.status(400).json({ "error": result.error.issues });
        }

        const protectPassword = await generateHash(password);

        const newUser = new User({
            email: email,
            name: name,
            password: protectPassword
        });

        await newUser.save();

        return res.status(201).json({ message: 'User created' });

    } catch (err) {


        if (err.code === 11000) {

            console.log(err);
            return res.status(400).json({ error: "Email id already exists" });


        }

        console.log(err);
        return res.status(500).json({ error: err });
    }











});

export default createUserRouter;