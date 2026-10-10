import { Router, type Request, type Response } from 'express';
import Category from '../../models/Category';
import { Route } from 'react-router';
import AuthMiddleware from '../../middleware/auth';
import requireAdmin from '../../middleware/auth';


const getCategory = Router();

getCategory.get('/categories',AuthMiddleware,requireAdmin, async (req: Request, res : Response) => {

    const allCategories = await Category.find({});

    return res.status(200).json({message: allCategories});



});



export default getCategory;