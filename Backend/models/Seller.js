import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        minlength: 10,
        required: true,
    },
    profilePicture:{
        type: String,
        default: '',
    },
    phoneNumber:{
        type: String,
    },
    county: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    orders:{
        type: Array,
        default: [],
    },
    products:[
        {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        }
    ],
    storeName:String,
    storeDescription:String,
    storePicture: String,
});

export default mongoose.model("Seller", sellerSchema);