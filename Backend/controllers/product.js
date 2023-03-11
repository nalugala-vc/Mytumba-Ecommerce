import Product from '../models/Product.js';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/*ADD NEW PRODUCT*/
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

/*UPDATE PRODUCT*/
export const updateProduct = async (req, res) => {
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
        category,
        subCategories,
        sizes,
        colors,} = req.body;
    const productId = req.params.productId;

    try {
        const product = await Product.findByIdAndUpdate(productId,{
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
        },{new: true});

        if(!product) return res.status(404).json({error: 'Product not found'});

        return res.status(200).json(product);

    } catch (error) {
        return res.status(404).json({error: error.message});
    }
}

/*DELETE PRODUCT*/
export const deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({message:'Product not found'});
        }

        const sellerId = product.seller.toString();

        await Product.deleteOne({ _id: productId });
        await User.updateMany({ cart: { $elemMatch: { product: productId } } }, { $pull: { cart: { product: productId } } });
        await Seller.updateOne({ _id: sellerId }, { $pull: { products: productId } });

        return res.status(200).json({message: "Product Deleted sucessfully"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

/*GET ALL PRODUCTS */
export const getAllProduct = async (req, res) => {
    try {
        let allProducts = await Product.find();

        if(!allProducts) return res.status(404).json({message: "No Product found"});

        return res.status(200).json({allProducts});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}