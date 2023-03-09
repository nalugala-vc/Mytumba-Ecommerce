import Admin from  "../models/Admin.js";
import bcrypt from 'bcrypt';
import jwt  from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
    const {
        email,
        password,
    } = req.body;

    try {
        let admin = await Admin.findOne({ email: email});

        if(!admin) return res.status(403).json({error: 'Not Found'});

        const isMatch = bcrypt.compare(password, admin.password);

        if(!isMatch) return res.status(403).json({error: 'Invalid Credentials'});

        const token = jwt.sign({id: admin._id}, "jkdshjbdjbnfgsjdkfdvjkajf");
        delete admin.password;

        return res.status(200).json({message:"Login successful",token:token,user: admin});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}