import express from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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