import mongoose from "mongoose";

const adminIds =[
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
]

export const admins = [
    {
        _id:adminIds[0],
        name:"Gonzaga Ogallo",
        email:"mzalendo@gmail.com",
        profilePicture: "rM.jfif",
        password:"$2b$10$wQ5s2eITwu9395TiEtWmGe.9Bl5gc8L8RGfMNA6PlJFH9ygkBuSCK"
    },
    {
        _id:adminIds[1],
        name:"Keith Baraka",
        email:"keithbaraka@gmail.com",
        profilePicture: "rM.jfif",
        password:"$2b$10$wQ5s2eITwu9395TiEtWmGe.9Bl5gc8L8RGfMNA6PlJFH9ygkBuSCK"
    }
]