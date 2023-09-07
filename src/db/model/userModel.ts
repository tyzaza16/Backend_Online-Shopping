import mongoose, { Schema, InferSchemaType } from "mongoose";

type transportStatus = 'prepare'| 'delivery' | 'cancel';


// create user schema
const userSchema = new Schema({
  email: { type:  String, required: true},
  password: { type: String, required: true},
  profileName: String,
  telNo: String,
  address: String,
  role: { type: String, require: true},
  likeProduct: [String],
  waitingPayment: [String],
  transportDetail: [{
    productId: String,
    status: String
  }],
});

// define type of user
type User = InferSchemaType<typeof userSchema>;

// create userModel for interact
const UserModel = mongoose.model('User', userSchema); // it auto s by defaults


export { UserModel, User };

