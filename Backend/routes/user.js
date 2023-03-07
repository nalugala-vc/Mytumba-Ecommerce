import express from 'express';
import { getAllUsers, login } from '../controllers/user.js';

const userRouter = express.Router();
userRouter.get('/',getAllUsers);
userRouter.post('/login',login);

export default userRouter;