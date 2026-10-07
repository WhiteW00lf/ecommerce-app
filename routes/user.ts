import express, { Router, type Request, type Response } from 'express';
import User from '../models/User';
import * as z from 'zod';

const createUserRouter = Router();

createUserRouter.post("/users", async (req: Request, res: Response) => {


    try {

        const { name, email, password } = req.body;

        const CheckUser = z.object({
            name: z.string().min(2),
            email: z.email(),
            password: z.string().min(8)


        });

        const result =  CheckUser.safeParse(req.body);

        if(result.error){
            return res.status(400).json({"error": result.error.issues.error});
        }
    


        const newUser = new User({
            email: email,
            name: name,
            password: password
        });

        await newUser.save();

        return res.status(201).json({ message: newUser });

    } catch (err) {


        if (err.code === 11000) {

            console.log(err);
            return res.status(400).json({ error: "Email id already exists" });


        }

        console.log(err);
    }











});

export default createUserRouter;