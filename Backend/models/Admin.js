import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default:""
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
    },
});

export default mongoose.model('Admin', adminSchema);