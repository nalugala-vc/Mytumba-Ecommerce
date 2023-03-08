import Product from '../models/Product.js';
import Seller from '../models/Seller.js';

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
        categories,
    } = req.body;

    const sellerId = req.params;

    try {

        let seller = await Seller.findById(sellerId);
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
            sizes,
            colors,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        await newProduct.save({session});

        seller.products.push(newProduct);
        await seller.save({session});
        await session.commitTransaction();

        return res.status(200).json({message: 'Product added successfully'});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}