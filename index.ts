import express, { Router, type Request, type Response } from 'express';
import main from './initDB.ts';
import connectToDB from './initDB.ts';

const app = express();

const router = Router();
const PORT = 3000;


app.use('/', router)
connectToDB(); // Connect to DB
router.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Home page" });

});



app.listen(PORT, () => console.log(` App running on ${PORT}`));


