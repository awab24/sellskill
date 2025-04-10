import mongoose from "mongoose";

const schema = mongoose.Schema;
const FAADCustomerSchema = new schema({
    name: String,
    email: String,
    number: String,

})
export const FAADCustomerModel = mongoose.model('FAADCustomer', FAADCustomerSchema)