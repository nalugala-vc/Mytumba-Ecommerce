import Seller from "../models/Seller.js";
import bcrypt from "bcrypt";
import Product from "../models/Product.js";

/* REGISTER NEW SELLER */
export const newSeller = async (req, res) => {

    const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        county,
        address,
        orders,
        products,
        storeName,
        storeDescription,
    } = req.body;

    const profilePicture = req.files.profilePicture[0].filename;
    const storePicture = req.files.storePicture[0].filename;


    try {
        let existingSeller = await Seller.findOne({email});

        if(existingSeller) return res.status(409).json({message: "Seller already exists. Sign in instead."});

        const salt = await bcrypt.genSalt(); 

        const hashedPassword = bcrypt.hashSync(password,salt);

        const newSeller = new Seller({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            profilePicture,
            phoneNumber,
            county,
            orders,
            products,
            address,
            storeName,
            storeDescription,
            storePicture,
        });

        const savedSeller = await newSeller.save();

        return res.status(200).json({savedSeller});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

/*SELLER LOGIN*/

export const loginSeller = async (req, res) => {
    const {email, password} = req.body;

    try {
        let seller = await Seller.findOne({email: email});

        if(!seller) {
            return res.status(404).json({message: 'Seller not found. Sign up instead'});
        }

        let isMatch = await bcrypt.compare(seller.email, password);

        if(!isMatch) return res.status(404).json({message: 'Invalid credentials'});

        const token = jwt.sign({id: seller._id}, "jkdshjbdjbnfgsjdkfdvjkajf");
        delete user.password;

        return res.status(200).json({message:"Login successful"});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

/*GET SELLER PRODUCTS*/

export const sellerProducts = async (req, res) => {
    const sellerId = req.params;

    try {
        let seller = await Seller.findById(sellerId);

        const products = await Promise.all(seller.products.map((product) => Product.findById(product)));

        const formattedProducts = products.map(
            ({id, name, description, pictures,quantity, price})=> {
                return {id, name, description, pictures,quantity, price}
        });

        return res.status(200).json(formattedProducts);

    }catch (err) {
        return res.status(500).json({error: err.message});
    }
}
