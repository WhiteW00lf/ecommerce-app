import { Router, type Request, type Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jsonwebtoken from 'jsonwebtoken';



const loginRouter = Router();

if (!process.env.SECRET) throw new Error('SECRET env var not set');
const TOKEN = process.env.SECRET;




loginRouter.post("/login", async (req: Request, res: Response) => {

    try {
        const CheckUser = z.object({
            email: z.email(),
            password: z.string().min(8)

        });

        const result = CheckUser.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ "error": result.error.issues });
        }

        const { email, password } = result.data;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ "message": "User does not exist" });
        } else {

            let isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ "message": "Email or Password is incorrect" });
            } else {

                const token = jsonwebtoken.sign({ userId: user._id, email: user.email, role: user.role },
                    TOKEN,
                    { expiresIn: '1h' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000
                }).status(200).json({ message: 'Login successful' });

            }

        }






    } catch (err) {




        console.log(err);


        return res.status(400).json({ "error": err })
    }





});

export default loginRouter;