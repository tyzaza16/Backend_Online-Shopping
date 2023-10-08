import { TransportStatus } from './../Constant';
import { Response, Request } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { HydratedDocument } from "mongoose";
import { IOrderList, User, UserModel } from "../db/model/userModel";
import { Product , ProductModel } from "../db/model/productModel";
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

    async updateBoughtProductToMerchant(
        email: string, 
        productList: updateQuantity[],
        transactionId: string 
        ): Promise<DtoResp> {

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        for(let product of productList) {

            const findProduct: Product | null = await ProductModel.findById({ _id: product.productId });

            if(!findProduct) {
                dtoResp.setMessage('Product does not exist in database!.');
                return dtoResp;
            }

            let orderList: IOrderList  = { 
                ...product, 
                status: TransportStatus.Prepare, 
                amount: product.quantity * findProduct.price,
                transactionIdRef: transactionId
            };
        
            const merchant: User | null = await UserModel.findOneAndUpdate(
                { email: findProduct.merchantEmail },
                { $push: {
                    orderList: orderList
                }},
                {new: true}
            );

            if(!merchant) {
                dtoResp.setMessage('Merchant does not exist in database!.');
                return dtoResp;
            }

        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Add product to user successfully.');
        return dtoResp;
    }

    async addStockOfProduct(email: string, productList: Product[], res: Response): Promise<Response> {

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        if( !this.validateAllPropsInProductArray(productList)) {
            dtoResp.setMessage('Invalid object properties!.');
            return res.status(200).json( dtoResp );
        }
    
        try {

            for(let product of productList) {
            
                const findProduct: HydratedDocument<Product> | null = await ProductModel.findOne({ 
                    merchantEmail: email, 
                    productName: product.productName 
                });
                
                console.log(findProduct);
                // if not have product : add new product
                if(!findProduct){

                    const productCount: number = await ProductModel.count();
                    
                    const newProduct: HydratedDocument<Product> = new ProductModel({
                        ...product,
                        productId: productCount+1,
                        merchantEmail: email,
                    });

                    console.log(newProduct);

                    await newProduct.save();
                }
                else {
                    findProduct.quantity += product.quantity;
                    await findProduct.save();
                }
                 
            }

            const currentProductList: Product[] | null = await ProductModel.find({ merchantEmail: email });
            
            dtoResp.setStatus(HandlerStatus.Success);
            dtoResp.setMessage('Update stock successfully!.');
            return res.status(200).json({ ...dtoResp, productList: currentProductList});
        }
        catch(err) {
            dtoResp.setMessage('Update stock unsuccessfully!.');
            return res.status(200).json({ ...dtoResp, err });
        }

        
    }

    async getWareHouseHistory( merchantEmail: string, res: Response ): Promise<Response>{

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        // if(use find it will return [] when not found document matched)
        // if(use findOne it will return null when not found document matched)
        let productList: Product[] | [] = await ProductModel.find({ merchantEmail }).lean(); 

        if(productList.length === 0) {
            dtoResp.setMessage(`you don't have product in store yet!.`);
            return res.status(422).json( dtoResp );
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage(`Successfully get warehouse history`);
        return res.status(200).json({ ...dtoResp, productList });
    }

    private validateAllPropsInProductArray(productList: Product[]): boolean {

        for(let product of productList) {
            
            if(
                // !product.id &&
                !product.productName &&
                // !product.productImage &&
                !product.price &&
                !product.quantity &&
                !product.merchantEmail &&
                // !product.brandName
                !product.netCost


            ){
                return false;
            }

        }

        return true;
    }
}

