import { Router, type Request, type Response } from 'express';

const LogoutRouter = Router();


LogoutRouter.post("/logout", (req: Request, res: Response) => {

    try {
        res.clearCookie('token');
        res.status(200).json({ "message": "Logged out successfully" });
        return res.status(302).redirect("/");
    } catch (err) {
        console.log(err);
    }



});




export default LogoutRouter;