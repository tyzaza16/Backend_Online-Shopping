import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { TransportStatus } from "../../Constant";

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

export type IOrderList = { 
  productId: string, 
  quantity: number, 
  status: TransportStatus, 
  amount: number,
  transactionIdRef: string 
};

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
  cart: [{
    productId : String,
    amount : Number
  }],
  waitingPayment: [String],
  orderList: [{
    productId: mongoose.Types.ObjectId,
    status: String,
    quantity: Number,
    amount: Number,
    transactionIdRef: mongoose.Types.ObjectId
  }],
  hashedCode: String,
  telNo: { type: String, required: true}
});

// define type of user
type User = InferSchemaType<typeof userSchema>;

// create userModel for interact
const UserModel: Model<User> = mongoose.model('User', userSchema); // it auto s by defaults


export { UserModel, User };

