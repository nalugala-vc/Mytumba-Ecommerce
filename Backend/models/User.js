import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        required: true,
        minlength: 8,
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
    cart:{
        type: Array,
        default: [],
    },
    wishlist:{
        type: Array,
        default: [],
    },
    orders:{
        type: Array,
        default: [],
    }
});

export default mongoose.model('User', userSchema);