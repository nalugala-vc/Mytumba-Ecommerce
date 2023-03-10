import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";
import { signUpUser, editUser } from './controllers/user.js';
import { newSeller, updateSeller } from './controllers/seller.js';
import sellerRouter from './routes/seller.js';
import productRouter from './routes/product.js';
import adminRouter from './routes/admin.js';
import { admins } from './data/index.js';
import Admin from './models/Admin.js';

/*CONFIGURATION*/
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "public/assets");
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

/*ROUTES WITH FILES*/
app.post('/user/register',upload.single('profilePicture'), signUpUser);
app.post('/seller/register',upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'storePicture', maxCount: 1 }
]), newSeller);
app.patch('/seller/:sellerId/update',upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'storePicture', maxCount: 1 }
]), updateSeller);
app.patch('/user/:userId/update',upload.single('profilePicture'), editUser);

/*ROUTES */
app.use(express.json());
app.use("/user",userRouter);
app.use("/seller",sellerRouter);
app.use("/product",productRouter);
app.use("/admin",adminRouter);

/*ADD DATA ONE TIME */

    // Admin.insertMany(admins);
    
/*DATABASE CONNECTION*/
mongoose.connect('mongodb+srv://VenessaChebukwa:Romulemia01@cluster0.hq8psm1.mongodb.net/MytumbaEcommerce?retryWrites=true&w=majority').then(()=> app.listen(5000)).then(()=>console.log("Connected to database and listening on port 5000"));