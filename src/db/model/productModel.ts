import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IProduct{
    productId: string;
    productName: string;
    productImage?: {
       data : Buffer,
       contentType : string
    };
    productDescription: {
        feature: string,
        detail: string,
        featureDetail: string,
        howToUse: string,
        suggestion: string,
        warning: string,
    };
    productSpecification: {
        material: string,
        height: number,
        width: number,
        depth: number,
        size: number
    };
    price: number;
    quantity: number;
    merchantEmail: string;
    brandName: string;
    netCost: number; 
    timestamp: Date;
}

// 2. Create a Schema corresponding to the document interface.
const productSchema = new Schema<IProduct>({
    productId: {type: String, required : true},
    productName: {type: String, required : true},
    productImage: {type: { data: Buffer, contentType: String}},
    productDescription: {type: {
        feature: String,
        detail: String,
        featureDetail: String,
        howToUse: String,
        suggestion: String,
        warning: String,
    }},
    productSpecification: {type: {
        material: String,
        height: Number,
        width: Number,
        depth: Number,
        size: Number
    }},
    price: {type: Number, required : true},
    quantity: {type: Number, default: 0,required : true},
    merchantEmail: {type: String, required: true},
    brandName: String,
    netCost: {type: Number, required : true},
    timestamp: {type: Date, required: true}
});

// 3. Create a Model.
const ProductModel = model<IProduct>('Product', productSchema);

export {ProductModel , IProduct as Product}

