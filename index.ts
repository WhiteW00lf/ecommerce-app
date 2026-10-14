import express, { Router, type Request, type Response } from 'express';
import createCartRouter from './routes/carts/cart.ts';
import getCartRouter from './routes/carts/getcart.ts';
import deleteCartRouter from './routes/carts/deletecart.ts';
import createOrderRouter from './routes/orders/orders.ts';
import cookieParser from 'cookie-parser';
import connectToDB from './initDB.ts';
import createUserRouter from './routes/user.ts';
import loginRouter from './routes/login.ts';
import AuthMiddleware from './middleware/auth.ts';
import requireAdmin from './middleware/admin.ts';
import LogoutRouter from './routes/logout.ts';
import createCategoryRouter from './routes/categories/category.ts';
import getCategory from './routes/categories/getcategory.ts';
import updateCategoryRouter from './routes/categories/updatecategory.ts';
import deleteCategoryRouter from './routes/categories/deletecategory.ts';
import createProductRouter from './routes/products/products.ts';
import getProductsRouter from './routes/products/getproducts.ts';
import updateProductRouter from './routes/products/updateproduct.ts';
import deleteProductRouter from './routes/products/deleteproduct.ts';
import updateCartRouter from './routes/carts/updatecart.ts'; 
import deleteOneCartRouter from './routes/carts/deleteone.ts';
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
app.use('/', getCategory);
app.use('/', updateCategoryRouter);
app.use('/', deleteCategoryRouter);
app.use('/', createProductRouter);
app.use('/', getProductsRouter);
app.use('/', updateProductRouter);
app.use('/', deleteProductRouter);
app.use('/', createCartRouter);
app.use('/', getCartRouter);
app.use('/', updateCartRouter);
app.use('/', deleteCartRouter);
app.use('/', deleteOneCartRouter);
app.use('/', createOrderRouter);

await connectToDB(); // Connect to DB
router.get("/", AuthMiddleware, (req: Request, res: Response) => {
    return res.status(200).json({ message: "Home page" });
});

router.get("/admin", AuthMiddleware, requireAdmin, (req: Request, res: Response) => {
    return res.status(200).json({ message: "Admin panel" });
});



app.listen(PORT, () => console.log(` App running on ${PORT}`));


