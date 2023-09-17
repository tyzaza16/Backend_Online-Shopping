import mongoose, { HydratedDocument, InferSchemaType, Model, Schema } from "mongoose";


const creditCardSchema = new Schema({
  cardNumber: { type: String, required: true},
  expirationDate: { type: String, required: true},
  holderName: { type: String, required: true},
  cvcCode: { type: Number, required: true},
  amount: { type: Number, required: true}
});

type CreditCard = InferSchemaType<typeof creditCardSchema>;

const CreditCardModel: Model<CreditCard> = mongoose.model('creditCard', creditCardSchema);

export {
  CreditCardModel, 
  CreditCard
}