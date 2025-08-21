import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        await mongoose.connect('mongodb+srv://23n227:23n227@cluster0.hv14xgk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.error("MongoDB connection failed:", error.message);
    }
}

