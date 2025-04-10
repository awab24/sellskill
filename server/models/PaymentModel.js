import mongoose from "mongoose";

const schema = mongoose.Schema;
const PaymentSchema = new schema({
    paymentId: String,
    payerId: String,
    amount: Number,
    status: String,
})

export const PaymentModel = mongoose.model('payment', PaymentSchema)