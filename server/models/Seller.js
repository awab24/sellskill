import mongoose from "mongoose";
  
const schema = mongoose.Schema;
const sellerSchema = new schema({
  _id: String,
    name: String,
    email: String,
    phoneNumber: Number,
    password: String,
    Image: String,
    description: String,
    FcmToken: String,
    joinedAt: Date,

    verified: Boolean,
    products: {
      name: String,
      description: String,
      price: Number,
      imageUrl: String,
      category: Array,

      stock: Number
    }
});

export const sellerModel = mongoose.model('seller', sellerSchema);
