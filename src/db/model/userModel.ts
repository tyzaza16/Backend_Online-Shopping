import mongoose, { Schema, InferSchemaType } from "mongoose";

// create user schema
const userSchema = new Schema({
  email: { type:  String, required: true},
  password: { type: String, required: true},
  firstName: String,
  lastName: String,
  telNo: Number,
  address: String,
  role: { type: String, require: true},
  likeProduct: [String],
  waitingPayment: [String]
});

// define type of user
type User = InferSchemaType<typeof userSchema>;

// create userModel for interact
const UserModel = mongoose.model('User', userSchema); // it auto s by defaults


export { UserModel, User};

