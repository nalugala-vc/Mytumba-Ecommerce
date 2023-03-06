import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    description: String,
    pictures:{
        type: Array,
        required: true,
    },
    tags:{
        type: Array,
        default: [],
    },
    reviews:{
        type: Array,
        default: [],
    },
    sizes:{
        type: Array,
        default: [],
    },
    colors:{
        type: Array,
        default: [],
    },
    categories:{
        type: Array,
        default: [],
    },
    seller:{
        type: mongoose.Types.ObjectId,
        ref:"Seller",
        required: true
    }
});

export default mongoose.model("Product", productSchema);