import mongoose from "mongoose";

const schema = mongoose.Schema;
const CodingCustomerSchema = new schema({
    name: String,
    email: String,
    number: String,

})
export const CodingCustomerModel = mongoose.model('CodingCustomer', CodingCustomerSchema)