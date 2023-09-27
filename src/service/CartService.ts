import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { User, UserModel } from "../db/model/userModel";
import { Product, ProductModel } from "../db/model/productModel";
import { HydratedDocument } from "mongoose";

export class CartService{
    static async addCart(req : Request, res : Response): Promise<Response> {
        const dtoResp = new DtoResp();
        const user : HydratedDocument<User> | null  = await UserModel.findOne({ email : req.body.email});
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }
        user?.cart.push(req.body.productId);
        await user?.save();
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("Add product to cart success")
        return res.status(200).json(dtoResp);
    
    }

    static async deleteCart(req : Request, res : Response): Promise<Response> {
        const dtoResp = new DtoResp();
        const user : HydratedDocument<User> | null  = await UserModel.findOne({ email : req.body.email});
        console.log(dtoResp);
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }

        const indexProduct =  user.cart.indexOf(req.body.productId);
        // return -1 when There's no productId match with array in Cart 
        if(indexProduct === -1 ){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("This productId doesn't have in cart");
            return res.status(200).json(dtoResp);
        }
        user?.cart.splice(indexProduct, 1);
        await user?.save();
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("Delete product to cart success")
        return res.status(200).json(dtoResp);
    
    }

    static async getCart(req : Request, res : Response): Promise<Response> {
        const dtoResp = new DtoResp();
        const user : HydratedDocument<User> | null  = await UserModel.findOne({ email : req.body.email});
        // check exist of user
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }
        // find detail product from productID in a cart
        const cartDetail : HydratedDocument<Product>[] | null  = await ProductModel.find(
            { productId : {$in : user?.cart} }
        );

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage("Get cart success");
        return res.status(200).json({
            ...dtoResp,
            cartDetail : cartDetail
        });

    }

    static async updateAmount(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const cartUpdated : HydratedDocument<User> | null  = await UserModel.findOneAndUpdate(
            { email : req.body.email},
            { cart : { }},
            { new : true }
        
        );
        if(!cartUpdated){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }
    }
}