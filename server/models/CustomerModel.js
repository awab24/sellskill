import mongoose from "mongoose";

const schema = mongoose.Schema;
const CustomerSchema = new schema({
    name: String,
    email: String,
    number: String,
})

export const CustomerModel = mongoose.model('customer', CustomerSchema)