import express from 'express';
import {addNewProduct,deleteProduct , updateProduct} from '../controllers/product.js';

const productRouter = express.Router();
productRouter.post('/add', addNewProduct);
productRouter.delete('/:productId/delete', deleteProduct);
productRouter.patch('/:productId/update', updateProduct);

export default productRouter;