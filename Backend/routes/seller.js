import express from 'express';
import {loginSeller, sellerProducts , getAllSellers} from '../controllers/seller.js';

const sellerRouter = express.Router();
sellerRouter.post('/login',loginSeller);
sellerRouter.get('/:id/products',sellerProducts);
sellerRouter.get('/',getAllSellers);

export default sellerRouter;