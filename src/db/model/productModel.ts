import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IProduct{
    productId: string;
    productName: string;
    productImage?: {
       data : Buffer,
       contentType : string
    };
    price: number;
    quantity: number;
    merchantEmail: string;
    brandName: string;
    netCost: number; 
}

// 2. Create a Schema corresponding to the document interface.
const productSchema = new Schema<IProduct>({
    productId: {type: String, required : true},
    productName: {type: String, required : true},
    productImage: {type: { data: Buffer, contentType: String}},
    price: {type: Number, required : true},
    quantity: {type: Number, default: 0,required : true},
    merchantEmail: {type: String, required: true},
    brandName: String,
    netCost: {type: Number, required : true},
});

// 3. Create a Model.
const ProductModel = model<IProduct>('Product', productSchema);

export {ProductModel , IProduct as Product}

