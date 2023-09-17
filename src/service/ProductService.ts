import { TransportStatus } from './../Constant';
import { Response, Request } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { HydratedDocument } from "mongoose";
import { User, UserModel } from "../db/model/userModel";
import { Product , ProductModel} from "../db/model/productModel";
import { updateQuantity } from '../db/model/transactionModel';

export class ProductService {
    static async likeProduct(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const user : HydratedDocument<User> | null  = await UserModel.findOneAndUpdate(
            { email : req.body.email },
            { $push : {likeProduct : req.body.productId} },
            { new : true}
        );
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system");
            return res.status(200).json(dtoResp);
        }
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage("like product success");
        return res.status(200).json(dtoResp);
    }

    static async dislikeProduct(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const user : HydratedDocument<User> | null  = await UserModel.findOneAndUpdate(
            { email : req.body.email },
            { $pull : { likeProduct : req.body.productId }},
            { new : true}
        );
        console.log(user);
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system");
            return res.status(200).json(dtoResp)
        }
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("dislike product success");
        return res.status(200).json(dtoResp);
    }

    static async searchProduct(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const productFinded : HydratedDocument<Product>[] | null = await ProductModel.find(
            {productName : {$regex : req.body.productName , $options : 'i'}},
            {new : true}
        )
        const productSuccess : HydratedDocument<Product>[] | null = await ProductModel.find(
            {_id : {$in : productFinded}}
        )
        
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("Search success");
        return res.status(200).json({...dtoResp, productSuccess});
    }


    async updateQuantityOfProducts(productList: updateQuantity[]): Promise<DtoResp> {

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        // loop through an array 
        for(let product of productList) {
            const updateResults: Product | null = await ProductModel.findOneAndUpdate(
                { _id: product.productId },
                { $inc:  {quantity: -product.quantity} },
                { new: true }
            );

            if(!updateResults){
                dtoResp.setMessage('Update quantity of product failed!.');
                return dtoResp;
            }

            if(updateResults.quantity < 0) {
                await ProductModel.findOneAndUpdate(
                    { _id: product.productId },
                    { $inc:  {quantity: product.quantity} }
                );

                dtoResp.setMessage('Product is out of stock!.');
                return dtoResp;
            }

        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Update Product Successfully!.');
        return dtoResp;

    }

    async updateBoughtProductToUser(email: string, productList: updateQuantity[]): Promise<DtoResp> {

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        const transportDetail: { productId: string, quantity: number, status: TransportStatus}[] = [];


        for(let product of productList) {
            transportDetail.push({ ...product, status: TransportStatus.Prepare });
        }

        console.log(transportDetail);


        const user: User | null = await UserModel.findOneAndUpdate(
            { email },
            { $push: 
                { transportDetail: 
                    {$each: transportDetail} 
                }
            },
            {new: true}
        );

        if(!user){
            dtoResp.setMessage('User not found!.');
            return dtoResp;
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Add product to user successfully.');
        return dtoResp;
    }
}