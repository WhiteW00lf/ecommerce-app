import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import Category from '../models/Category';
import AuthMiddleware from '../middleware/auth';
import requireAdmin from '../middleware/admin';


const createCategoryRouter = Router();


createCategoryRouter.post('/categories',AuthMiddleware,requireAdmin, async (req: Request, res: Response) => {

    try {
        const checkCategory = z.object({
            name: z.string().min(1),
            slug: z.string().min(1)
        });


        const result = checkCategory.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.error.message });
        }

        const { name, slug } = result.data;

        let category = await Category.findOne({ name });

        if (category) {
            return res.status(400).send({ message: "Category already exists" });
        } else {

            const category = new Category({
                name: result.data.name,
                slug: result.data.slug
            });

            await category.save();

            return res.status(201).send({message: "Category created"});

        }
        
    }catch (err) {
            console.log(err)
            return res.status(500).send({error: "Internal server error"})

        }





    });


    export default createCategoryRouter;