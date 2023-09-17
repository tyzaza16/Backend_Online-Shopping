import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

type transportStatus = 'prepare'| 'delivery' | 'cancel';

export type IAddress = {
  _id: string,
  firstName: string;
  lastName: string;
  telNo: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  code: string;
}

// create user schema
const userSchema = new Schema({
  email: { type:  String, required: true},
  password: { type: String, required: true},
  profileName: { type: String, required: true},
  address: { type: [{
    firstName: String,
    lastName: String,
    telNo: String,
    address: String,
    subDistrict: String,
    district: String,
    province: String,
    code: String,
  }], required: true},
  role: { type: String, required: true},
  likeProduct: [String],
  cart: [String],
  waitingPayment: [String],
  transportDetail: [{
    productId: String,
    status: String
  }],
  hashedCode: String
});

// define type of user
type User = InferSchemaType<typeof userSchema>;

// create userModel for interact
const UserModel: Model<User> = mongoose.model('User', userSchema); // it auto s by defaults


export { UserModel, User };

