import { Router, type Request, type Response } from 'express';

const LogoutRouter = Router();


LogoutRouter.post("/logout", (req: Request, res: Response) => {

    try {
        res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'strict' });

        return res.status(200).json({ "message": "Logged out successfully" });

    } catch (err) {
        console.log(err);
    }



});




export default LogoutRouter;