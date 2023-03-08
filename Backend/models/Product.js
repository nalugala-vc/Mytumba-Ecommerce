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
    discount: {
        type: Boolean,
        default: false,
    },
    discountPrice:{
        type:mongoose.Types.Decimal128,
        default: 0.0,
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
    category:{
        type: String,
        required: true,
    },
    subCategories:{
        type: String,
        required: true,
    },
    seller:{
        type: mongoose.Types.ObjectId,
        ref:"Seller",
        required: true
    }
});

export default mongoose.model("Product", productSchema);