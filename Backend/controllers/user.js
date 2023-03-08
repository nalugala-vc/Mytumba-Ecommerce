import express from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Product from '../models/Product.js';
import shortid from 'shortid';

/*REGISTER NEW USER*/

export const signUpUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        profilePicture,
        phoneNumber,
        county,
        address,
        cart,
        wishlist,
        orders,
    } = req.body;

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
    const { userId, productId} = req.params;

    try {
        let user = await User.findById({userId});
        let product = await Product.findById({productId});

        if(user.cart.includes(product)){
            return res.status(409).json({message: "Product already in cart"});
        }else{
            user.cart.push({product:productId, quantity:1, price:product.price});
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
    const { userId, productId} = req.params;
    const quantity = req.body;

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        const cartIndex = user.cart.findIndex(item => item.product === productId);

        if (cartIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        user.cart[cartIndex].quantity = quantity;
        
        const newPrice = quantity*product.price;

        user.cart[cartIndex].price = newPrice;

        await user.save();

        const cartProducts =  await Promise.all(
            user.cart.map((item) => Product.findById(item.product))
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


/*REMOVE FROM CART*/

export const removeCartProduct = async (req, res) => {
    const {userId,productId} = req.params;

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        user.cart.filter((id)=> id!== productId);

        user.save();

        return res.status(200).json({message: 'Product removed successfully'});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}


/*GET USERS CART ITEMS */

export const getCartItems = async (req, res) => {
    const {userId} = req.params;
    let user;

    try {
        user = await User.findById(userId);
        
        const cartItems = await Promise.all(
            user.cart.map((productId)=>Product.findById(productId))
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
  const randomString = shortid.generate();

  return `${timestamp}${randomString}`;
}


/* ORDER THE PRODUCTS IN CART */
export const orderProducts = async (req, res) => {
    const orderId = generateRandomString();

    const userId = req.params;

    try {
        const user = await User.findById(userId);

        const cartItems = await Promise.all(
            user.cart.map((productId=>Product.findById(productId)))
        );

        const formattedProducts = cartItems.map(
            ({_id,name,pictures,price,quantity})=>{
                return {_id,name,pictures,price,quantity}
            }
        );

    } catch (error) {
        
    }
}
