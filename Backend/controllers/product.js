import Product from '../models/Product.js';
import Seller from '../models/Seller.js';
import mongoose from 'mongoose';

export const addNewProduct = async (req,res) => {
    const {
        name,
        description,
        pictures,
        tags,
        price,
        reviews,
        quantity,
        discount,
        discountPrice,
        shipping,
        sizes,
        colors,
        category,
        subCategories,
        seller,
    } = req.body;

    try {

        let existingSeller = await Seller.findById(seller);
        const newProduct = new Product({
            name,
            description,
            pictures,
            tags,
            price,
            reviews,
            quantity,
            discount,
            discountPrice,
            shipping,
            category,
            subCategories,
            sizes,
            colors,
            seller,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        await newProduct.save({session});

        existingSeller.products.push(newProduct);
        await existingSeller.save({session});
        await session.commitTransaction();

        return res.status(200).json({message: 'Product added successfully'});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}