import Product from '../models/Product.js';
import Seller from '../models/Seller.js';
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
    const productId = req.params.ProductId;

    try {
        const product = await Product.findByIdAndDelete(productId);

        if(!product) return res.status(404).json({error:"Product does not exist"});

        return res.status(200).json({message:"Product deleted successfully"});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};