import express, { Router, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import connectToDB from './initDB.ts';
import createUserRouter from './routes/user.ts';
import loginRouter from './routes/login.ts';
import AuthMiddleware from './middleware/auth.ts';
import requireAdmin from './middleware/admin.ts';
import LogoutRouter from './routes/logout.ts';
import createCategoryRouter from './routes/category.ts';
const app = express();

const router = Router();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/', router);
app.use('/', createUserRouter);
app.use('/', loginRouter);
app.use('/', LogoutRouter);
app.use('/', createCategoryRouter);

await connectToDB(); // Connect to DB
router.get("/", AuthMiddleware, (req: Request, res: Response) => {
    return res.status(200).json({ message: "Home page" });
});

router.get("/admin", AuthMiddleware, requireAdmin, (req: Request, res: Response) => {
    return res.status(200).json({ message: "Admin panel" });
});



app.listen(PORT, () => console.log(` App running on ${PORT}`));


