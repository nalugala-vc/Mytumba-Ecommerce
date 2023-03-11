import express from 'express';
import { getAllUsers, login, addToCart ,getCartItems, updateCartItemQuantity , deleteCartItem ,orderProducts, cancelOrder} from '../controllers/user.js';

const userRouter = express.Router();
userRouter.get('/',getAllUsers);
userRouter.post('/login',login);
userRouter.post('/addToCart',addToCart);
userRouter.get('/:id/cartItems',getCartItems);
userRouter.patch('/changeQuantity',updateCartItemQuantity);
userRouter.patch('/removeFromCart',deleteCartItem);
userRouter.patch("/orders",orderProducts);
userRouter.patch('/:orderNumber/cancel',cancelOrder);


export default userRouter;