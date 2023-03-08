import express from 'express';
import {addNewProduct} from '../controllers/product.js';

const productRouter = express.Router();
productRouter.post('/add', addNewProduct);

export default productRouter;