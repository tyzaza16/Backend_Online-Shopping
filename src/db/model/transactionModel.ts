import mongoose, { Schema, InferSchemaType, Model } from "mongoose";


const transactionSchema = new Schema({
  email: {type: String, required: true},
  productId: {type: [String], required: true},
  totalAmount: {type: Number, required: true},
  timestamp: {type: Date, required: true}
});

type Transaction = InferSchemaType<typeof transactionSchema>;

const TransactionModel: Model<Transaction> = mongoose.model('Transaction', transactionSchema); 

export {
  Transaction,
  TransactionModel
}