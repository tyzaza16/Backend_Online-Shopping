import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { User, UserModel } from "../db/model/userModel";
import { Product, ProductModel } from "../db/model/productModel";
import { HydratedDocument } from "mongoose";

export class CartService{
    static async addCart(req : Request, res : Response): Promise<Response> {
        const dtoResp = new DtoResp();
        const user : HydratedDocument<User> | null  = await UserModel.findOneAndUpdate(
            { email : req.body.email },
            { $push : { cart : { productId : req.body.productId, amount : req.body.amount }}},
            { new : true }
        );
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("Add product to cart success")
        // return res.status(200).json({...dtoResp, user});
        return res.status(200).json(dtoResp);
    
    }

    static async deleteCart(req : Request, res : Response): Promise<Response> {
        const dtoResp = new DtoResp();
        const user : HydratedDocument<User> | null  = await UserModel.findOne({ email : req.body.email });
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }

        const indexProduct =  user.cart.findIndex((product)=>{
            return product.productId === req.body.productId
        });
        // return -1 when There's no productId match with array in Cart 
        console.log(indexProduct)
        if(indexProduct === -1 ){
            dtoResp.setStatus(HandlerStatus.Failed);
            dtoResp.setMessage("This productId doesn't have in cart");
            return res.status(200).json(dtoResp);
        }
        user?.cart.splice(indexProduct, 1);
        await user?.save();
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("Delete product on cart success")
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

        // keep productId from cart
        const filterProductIdCart = user.cart.map((obj)=>{
            return obj.productId;
        })

        // find detail product from productID in a cart
        const productDetailCart : HydratedDocument<Product>[] | null  = await ProductModel.find(
            { productId : {$in : filterProductIdCart} }
        ).sort({ productId : 1});
        
        // add amount in productDetailCart
        const productDetailCartAmount = productDetailCart.map((product)=>{
            const i = user?.cart.findIndex((obj)=>{
                return product.productId == obj.productId
            })
            return {...product.toObject(), amount : user?.cart[i].amount}
        })

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage("Get cart success");
        return res.status(200).json({
            ...dtoResp,
            cartDetail : productDetailCartAmount
        });

    }

    static async updateAmount(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const cartUpdated : HydratedDocument<User> | null  = await UserModel.findOneAndUpdate(
            { email : req.body.email , "cart.productId" : req.body.productId},
            { $set : {"cart.$.amount" : req.body.amount }},
            { new : true }
        
        );
        if(!cartUpdated){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system or productId doesn't have in cart")
            return res.status(200).json(dtoResp);
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage("Update success");
        return res.status(200).json(dtoResp);
    }

    async clearCart(email: string, res: Response): Promise<DtoResp> {
        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        const user: User | null = await UserModel.findOneAndUpdate(
            { email },
            { $set: { cart: []} },
            { new: true }
        );

        if(!user) {
            dtoResp.setMessage('Not found user!.');
            return dtoResp;
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Clear cart success!.');
        return dtoResp;
    } 
}