import express from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Product from '../models/Product.js';
import shortid from 'shortid';
import mongoose from 'mongoose';
import Seller from '../models/Seller.js';

/*REGISTER NEW USER*/

export const signUpUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        county,
        address,
        cart,
        wishlist,
        orders,
    } = req.body;

    const profilePicture =req.file.filename;

    let existingUser;

    try {
        existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(409).json({message: "User already exists. Sign in instead"});
        }

        const salt = await bcrypt.genSalt(); 

        const hashedPassword = bcrypt.hashSync(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicture,
            phoneNumber,
            county,
            address,
            cart,
            wishlist,
            orders,
        });

        const savedUser = await newUser.save();

        return res.status(200).json({ savedUser });
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

/*USER LOGIN */
export const login = async (req, res) => {
    const {email, password} = req.body;
    let user;

    try {
        user = await User.findOne({email:email});

        if(!user) {
            return res.status(404).json({error: 'User not found. Sign up instead'});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch) return res.status(404).json({error: 'Invalid Credentials'}); 

        const token = jwt.sign({id: user._id}, "jkdshjbdjbnfdkfdvjkajf");
        delete user.password;
        res.status(200).json({ message:"Loggin Successful" ,token, user});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

/* EDIT USER */
export const editUser = async (req, res) => {
    const userId = req.params.userId;
    const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        county,
        address,
    } = req.body;

    const profilePicture =req.file.filename;

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.findByIdAndUpdate(userId,
            {
                firstName,
                lastName,
                email,
                password:hashedPassword,
                profilePicture,
                phoneNumber,
                county,
                address,
            },{new : true}
        )

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

/*GET ALL USERS*/
export const getAllUsers = async(req, res) => {
    let users;

    try {
        users = await User.find();

        if(!users){
            return res.status(404).json({message: 'No users found'});
        }

        return res.status(200).json({users});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

/*ADD TO CART FUNCTIONALITY */

export const addToCart = async (req, res) => {
    const  productId  = req.body.productId;
    const userId = req.body.userId;

    try {
        let user = await User.findById(userId);
        let product = await Product.findById(productId);

        if(user.cart.some(item => item.product === productId)){
            return res.status(409).json({message: "Product already in cart"});
        }else{
            user.cart.push({_id: productId, product: productId, quantity: 1, price: product.price});
        }

        await user.save();

        const cartProducts =  await Promise.all(
            user.cart.map((id) => User.findById(id))
        );

        const formattedProducts = cartProducts.map(
            ({_id,name,pictures,price,quantity}) => {
                return {_id,name,pictures,price,quantity}
            }
        );

        return res.status(200).json(formattedProducts);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

/*UPDATE PRODUCT QUANTITY*/
export const updateCartItemQuantity = async (req, res) => {
    const userId = req.body.userId.toString();
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    try {
        let product = await Product.findById(productId);

        const price = quantity*product.price
        const result = await User.findOneAndUpdate(
            { _id: userId, 'cart.product': productId },
            { $set: { 'cart.$.quantity': quantity, 'cart.$.price':price } },
            { new: true }
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}


/*REMOVE FROM CART*/

export const deleteCartItem = async (req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;

    try {
        const user = await User.findById(userId);
    
        const cartIndex = user.cart.findIndex(item => item.product.toString() === productId);
    
        if (cartIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    
        user.cart.splice(cartIndex, 1);
    
        await user.save();
    
        const cartProducts =  await Promise.all(
            user.cart.map((item) => Product.findById(item.product))
        );

        const formattedProducts = cartProducts.map(
            ({_id,name,pictures,price,quantity}) => {
            const cartItem = user.cart.find(item => item.product.toString() === _id.toString());
            return {_id,name,pictures,price,quantity: cartItem.quantity, totalPrice: cartItem.price}
            }
        );

        return res.status(200).json({message: "Item deleted successfully",newItems: formattedProducts});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}



/*GET USERS CART ITEMS */

export const getCartItems = async (req, res) => {
    const userId = req.params.id;
    let user;

    try {
        user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const cartItems = await Promise.all(
            user.cart.map(({ product }) => Product.findById(new mongoose.Types.ObjectId(product)))
        );

        const formattedProducts = cartItems.map(
            ({_id,name,pictures,price,quantity})=>{
                return {_id,name,pictures,price,quantity}
            }
        );

        return res.status(200).json({formattedProducts})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/*GENERATE A UNIQUE ID FOR THE ORDERS*/

function generateRandomString() {
  const timestamp = Date.now();

  return timestamp;
}

/*{
    "error": "Cannot destructure property '_id' of 'object null' as it is null."
}*/

/* ORDER THE PRODUCTS IN CART */
export const orderProducts = async (req, res) => {
    const orderNumber = generateRandomString();
    const userId = req.body.userId;
    try {
        const user = await User.findOne({ _id: userId });

        // Get the product documents from the database based on the IDs in the user's cart
        const products = await Product.find({ _id: { $in: user.cart } }).lean();

        const product  = await Product.find({ _id: { $in: user.cart } });
        if(user.cart.length === 0) return res.status(404).json({ message:"No items in your cart" });
        
        // Create an array of order items for the user
        const orderItems = await Promise.all(
            products.map(async (product) => {
                const cartItem = user.cart.find(item => item.product.toString() === product._id.toString());
                const updatedSeller = await Seller.findByIdAndUpdate(
                product.seller,
                {
                    $push: {
                        orders: {
                            orderId: orderNumber,
                            productId: product._id,
                            quantity: cartItem.quantity,
                            status:"pending",
                            },
                    },
                },
                { new: true } // return the updated document
                );
              const updatedProduct = await Product.findByIdAndUpdate(
                product._id,
                { $inc: { quantity: - cartItem.quantity, } }, // decrement the quantity by 1
                { new: true } // return the updated document
              );
              return {
                orderId: orderNumber,
                productId: product._id,
                sellerId: product.seller,
                quantity: cartItem.quantity,
                status: "pending", // include the updated seller orders in the order item object
              };
            })
          );
        
        // Push the order items to the user's orders field
        await User.updateOne({ _id: userId }, { $push: { orders: { $each: orderItems } }, cart : [] });

        return res.status(200).json({messages: "Order placed successfully"})
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

/* CANCEL ORDER */
//user can cancel order...just updates the order status to cancelled , add back the quantity to the products
export const cancelOrder = async (req , res , next) => {
    const orderNumber = parseInt(req.params.orderNumber);
    const userId = req.body.userId;

    try {
        let user = await User.findOneAndUpdate(
            { "_id": userId, "orders.orderId": orderNumber },
            { $set: { "orders.$.status": "canceled" } },{new:true }
        );
        
        if(!user) return res.status(404).json({message: "User not found",orderNumber});

        let order = user.orders.find(order => order.orderId === orderNumber);
        let productId = order.productId;
        let quantity = Number(order.quantity);

        if (isNaN(quantity)) {
            throw new Error("Invalid quantity value: " + order.quantity);
        }

        let products = await Product.findOneAndUpdate(
            {"_id": productId },{ $inc: { quantity: + quantity, } }
        );

        let seller = await Seller.findOneAndUpdate({
            "orders.orderId": orderNumber
        }, { $set: { "orders.$.status": "canceled"}});

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error : error.message });
    }
}




