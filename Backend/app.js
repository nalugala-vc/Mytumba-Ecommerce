import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";
import { signUpUser } from './controllers/user.js';

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

/*ROUTES */
app.use(express.json());
app.use("/user",userRouter);

/*DATABASE CONNECTION*/
mongoose.connect('mongodb+srv://VenessaChebukwa:Romulemia01@cluster0.hq8psm1.mongodb.net/MytumbaEcommerce?retryWrites=true&w=majority').then(()=> app.listen(5000)).then(()=>console.log("Connected to database and listening on port 5000"));