import mongoose from "mongoose";
  
const schema = mongoose.Schema;
const customerSchema = new schema({
  _id: String,
    name: String,
 
    phoneNumber: Number,
 
    location: String,
    FcmToken: String,
    joinedAt: Date,

    orders: {
        name: String,
        description: String,
        price: Number,
        imageUrl: String,
        category: Array,

        status: Boolean
    }
});

export const CustomerrModel = mongoose.model('customerrr', customerSchema);
