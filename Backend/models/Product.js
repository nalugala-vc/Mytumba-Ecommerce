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
    price:{
        type:mongoose.Types.Decimal128,
        required: true,
    },
    reviews:{
        type: Array,
        default: [],
    },
    quantity:{
        type: Number,
        required: true,
    },
    discount: Boolean,
    discountPrice:{
        type:mongoose.Types.Decimal128
    },
    shipping:{
        type:mongoose.Types.Decimal128
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