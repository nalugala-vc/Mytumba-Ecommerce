import express from 'express';
import {loginSeller, sellerProducts} from '../controllers/seller.js';

const sellerRouter = express.Router();
sellerRouter.post('/login',loginSeller);
sellerRouter.get('/:id/products',sellerProducts);

export default sellerRouter;