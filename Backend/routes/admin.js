import express from 'express';
import { loginAdmin } from '../controllers/admin.js';

const adminRouter = express.Router();
adminRouter.post('/login',loginAdmin);

export default adminRouter;