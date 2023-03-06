import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb+srv://VenessaChebukwa:Romulemia01@cluster0.hq8psm1.mongodb.net/MytumbaEcommerce?retryWrites=true&w=majority').then(()=> app.listen(5000)).then(()=>console.log("Connected to database and listening on port 5000"));