import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

export type updateQuantity = {
  productId: string,
  quantity: number
};

const transactionSchema = new Schema({
  email: {type: String, required: true},
  productList: {type: [{
    productId: String,
    quantity: Number
  }], required: true},
  totalAmount: {type: Number, required: true},
  timestamp: {type: Date, required: true}
});

type Transaction = InferSchemaType<typeof transactionSchema>;

const TransactionModel: Model<Transaction> = mongoose.model('Transaction', transactionSchema); 

export {
  Transaction,
  TransactionModel
}