import express, { Router, type Request, type Response } from 'express';
import connectToDB from './initDB.ts';
import createUserRouter from './routes/user.ts';
import loginRouter from './routes/login.ts';
const app = express();

const router = Router();
const PORT = 3000;

app.use(express.json());
app.use('/', router);
app.use('/', createUserRouter);
app.use('/', loginRouter);

await connectToDB(); // Connect to DB
router.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Home page" });

});



app.listen(PORT, () => console.log(` App running on ${PORT}`));


