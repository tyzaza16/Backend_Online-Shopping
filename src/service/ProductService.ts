import { TransportStatus } from './../Constant';
import { Response, Request } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { HydratedDocument } from "mongoose";
import { IOrderList, User, UserModel } from "../db/model/userModel";
import { Product , ProductModel } from "../db/model/productModel";
import { TransactionModel, updateQuantity } from '../db/model/transactionModel';

interface ProductWithImageLink extends Product {
    productImageLink?: string
}

interface BestSellerProduct extends Product{
    soldQuantity: number;
    productDetail: ProductWithImageLink;
}

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

    static async getLikeProduct(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const productDetail : Product[] = await UserModel.aggregate([
            {
                $match:{
                    email : req.body.email
                }
            },
            {
                $unwind: "$likeProduct"
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'likeProduct',
                    foreignField: 'productId',
                    as: 'productDetail'
                }
            },
            {
                $unwind: "$productDetail"
            },
            {
                $group:{
                    _id : "$productDetail._id",
                    productDetail : {
                        $first: "$productDetail"
                    },
                }
            },
            {
                $unset: [
                    "productDetail.netCost",
                    "productDetail.merchantEmail",
                 ]
            },
            {
                $replaceRoot: {
                    newRoot: '$productDetail'
                }
            }
        ]);
        if(!productDetail){
            dtoResp.setStatus(HandlerStatus.Failed)
            dtoResp.setMessage("Email doesn't exist in system");
            return res.status(200).json(dtoResp);
        }
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage("get like product success");
        return res.status(200).json({...dtoResp, productDetail : productDetail});
    }

    static async searchProduct(req : Request, res: Response){
        const dtoResp = new DtoResp;
        const productFinded : HydratedDocument<Product>[] | null = await ProductModel.find(
            {productName : {$regex : req.body.productName , $options : 'i'}, delFlag: false},
            {new : true}
        )
        console.log(productFinded);
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
                { new: true, projection: { productImage: 0} }
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

            const findProduct: Product | null = await ProductModel.findById(
                { _id: product.productId },
                { productImage: 0}
            );

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
                    productName: product.productName,
                    delFlag: false
                });
        
                // if not have product : add new product
                if(!findProduct){

                    const productCount: number = await ProductModel.count();
                    
                    const newProduct: HydratedDocument<Product> = new ProductModel({
                        ...product,
                        productId: productCount+1,
                        merchantEmail: email,
                        timestamp: new Date()
                    });

                    await newProduct.save();
                }
                else {
                    findProduct.quantity += product.quantity;
                    await findProduct.save();
                }
                 
            }

            const currentProductList: Product[] | null = await ProductModel.find({ merchantEmail: email, delFlag: false }, {productImage: 0});
            
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
        let productList: Product[] | [] = await ProductModel.find
        (
            { merchantEmail },
            { productImage: 0}
        ).lean(); 

        if(productList.length === 0) {
            dtoResp.setMessage(`you don't have product in store yet!.`);
            return res.status(200).json( dtoResp );
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage(`Successfully get warehouse history`);
        return res.status(200).json({ ...dtoResp, productList });
    }

    async getProductManagement( merchantEmail: string, res: Response ): Promise<Response>{

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        // if(use find it will return [] when not found document matched)
        // if(use findOne it will return null when not found document matched)
        let productList: Product[] | [] = await ProductModel.find
        (
            { merchantEmail, delFlag: false },
            { productImage: 0}
        ).lean(); 
        

        if(productList.length === 0) {
            dtoResp.setMessage(`you don't have product in store yet!.`);
            return res.status(200).json( dtoResp );
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage(`Successfully get warehouse history`);
        return res.status(200).json({ ...dtoResp, productList });
    }

    static async getBestSeller(
        req :Request, res: Response
    ): Promise<Response> {

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        const date: Date = new Date();
        const currentMonthDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);

        const bestSellerProduct: BestSellerProduct[] = await TransactionModel.aggregate([

            {
                $match: {
                    $expr: {
                        $gt: [
                            "$timestamp", 
                            currentMonthDate
                        ]
                    }
                }
            },
            {
                $unwind: "$productList"
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productList.productId',
                    foreignField: '_id',
                    as: 'productDetail'
                }
            },
            {
                $unwind: "$productDetail"
            },
            {
                $group: {
                    _id: "$productList.productId",
                    soldQuantity: {
                        $sum: "$productList.quantity"
                    },
                    productDetail: {
                        $first: "$productDetail"
                    }
                }
            },
            {
                $match: {
                    "productDetail.delFlag": false
                }
            },
            {
                $sort: {
                    soldQuantity: -1
                }
            },
            {
                $limit: 10
            }

        ]);

        if(bestSellerProduct.length === 0) {
            dtoResp.setMessage('No product sold in this month.!');
            return res.status(200).json({ ...dtoResp, bestSellerProduct});
        }

        if(req.body.email){ // There is user login
            const user : User | null  = await UserModel.findOne({ email : req.body.email});
            const LikeandBestSellerProduct = bestSellerProduct.map((product)=>{
                const islikeProduct = user?.likeProduct.find((likeProduct_id)=>{
                    return likeProduct_id === product.productDetail.productId;
                })
                return {...product, islike : islikeProduct ? true : false}
            })
            
            dtoResp.setStatus(HandlerStatus.Success);
            dtoResp.setMessage('Successfully get data!.');
            return res.status(200).json({ ...dtoResp, bestSellerProduct : LikeandBestSellerProduct });
        }

        // let bestSellerList: BestSellerProduct[] = []
        // for(let bestSeller of bestSellerProduct) {

        //     if(bestSeller.productDetail.productImage) {
        //         const linkImage: string = `data:${bestSeller.productDetail.productImage.contentType};base64,${bestSeller.productDetail.productImage.data.toString('base64')}`;
        //         delete bestSeller.productDetail.productImage;
        //         const temp = { ...bestSeller, productDetail: { ...bestSeller.productDetail, productImageLink: linkImage} }
        //          bestSellerList.push(temp);
        //     }else {
        //         bestSellerList.push(bestSeller)
        //     }
        // }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Successfully get data!.');
        return res.status(200).json({ ...dtoResp, bestSellerProduct });

    }

    static async suggestProduct(req :Request, res: Response): Promise<Response> {

        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);

        const randomProduct: Product[] = await ProductModel.aggregate([
            {
                $match: {
                    $expr: {
                        $gte: [
                            "$quantity",
                            1
                        ]
                    }
                }
            },
            {
                $match: {
                    delFlag: false
                }
            },
            {
                $unset: [
                    "productImage"
                ]
            },
            {
                $sample: { size: 10}
            }
        ]);

        if( randomProduct.length === 0 ) {
            dtoResp.setMessage('All product out of stock');
            return res.status(200).json({ ...dtoResp, randomProduct });
        }

        if(req.body.email){ // There is user login
            const user : User | null  = await UserModel.findOne({ email : req.body.email});
            const LikeandRandomProduct = randomProduct.map((product)=>{
                const islikeProduct = user?.likeProduct.find((likeProduct_id)=>{
                    return likeProduct_id === product.productId;
                })
                return {...product, islike : islikeProduct ? true : false}
            })
            dtoResp.setStatus(HandlerStatus.Success);
            dtoResp.setMessage('Successfully get data!.');
            console.log(LikeandRandomProduct);
            return res.status(200).json({ ...dtoResp, randomProduct : LikeandRandomProduct });
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Successfully get data!.');
        return res.status(200).json({ ...dtoResp, randomProduct });
    }

    static async getNewestProduct(req :Request, res: Response): Promise<Response> {
        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Successfully find newest product!.');

        const newestProduct: Product[] = await ProductModel.find({ delFlag: false}, {productImage: 0})
        .sort({
            timestamp: -1
        }).limit(10).lean();

        if(req.body.email){ // There is user login
            const user : User | null  = await UserModel.findOne({ email : req.body.email});
            const LikeandBestSellerProduct = newestProduct.map((product)=>{
                const islikeProduct = user?.likeProduct.find((likeProduct_id)=>{
                    return likeProduct_id === product.productId;
                })
                console.log({...product});
                return {...product, islike : islikeProduct ? true : false}
            })
            dtoResp.setStatus(HandlerStatus.Success);
            dtoResp.setMessage('Successfully get data!.');
            return res.status(200).json({ ...dtoResp, newestProduct : LikeandBestSellerProduct });
        }
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Successfully get data!.');
        return res.status(200).json({...dtoResp, newestProduct});
    }

    async deleteProduct(id: string, res: Response): Promise<Response> {
        const dtoResp: DtoResp = new DtoResp();
        dtoResp.setStatus(HandlerStatus.Failed);
        dtoResp.setMessage('Product not found !.');

        const delProduct: User | null = await ProductModel.findByIdAndUpdate(
            id,
            { delFlag: true},
            { new: true }
        );
        
        if(!delProduct) {
            return res.status(200).json( dtoResp );
        }

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Delete product success!.');
        return res.status(200).json(dtoResp);
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

