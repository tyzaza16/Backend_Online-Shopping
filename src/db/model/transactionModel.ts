import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

export type updateQuantity = {
  productId: string,
  quantity: number,
  amount: number
};



const transactionSchema = new Schema({
  email: {type: String, required: true},
  productList: {type: [{
    productId: Schema.Types.ObjectId,
    quantity: Number,
    merchantEmail: String
  }], required: true},
  status: {type: Boolean, requried: true},
  address: {type: Object, required: true},
  totalAmount: {type: Number, required: true},
  timestamp: {type: Date, required: true}
});

type Transaction = InferSchemaType<typeof transactionSchema>;

const TransactionModel: Model<Transaction> = mongoose.model('Transaction', transactionSchema); 

export {
  Transaction,
  TransactionModel
}