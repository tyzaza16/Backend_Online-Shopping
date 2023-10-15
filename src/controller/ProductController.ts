import {post, controller, bodyValidator, get } from "./decorators";
import { Request, Response } from "express";
import { ProductService } from "../service/ProductService";

@controller('/product')
class ProductController{
    @post('/likeProduct')
    addCart(req : Request, res : Response){
        ProductService.likeProduct(req, res);
    }

    @post('/dislikeProduct')
    delete(req : Request, res : Response){
        ProductService.dislikeProduct(req, res);
    }

    @post('/getLikeProduct')
    getLikeProduct(req : Request, res : Response){
        ProductService.getLikeProduct(req, res);
    }

    @post('/searchProduct')
    getData(req : Request, res : Response){
        ProductService.searchProduct(req, res);
    }

    @post('/suggest_product')
    suggestProduct(req: Request, res: Response) {
        return ProductService.suggestProduct(req, res);
    }

    @post('/best_selling')
    bestSellingProduct(req: Request, res: Response) {
        return ProductService.getBestSeller(req, res);
    }

    @post('/newest')
    newestProduct(req: Request, res: Response) {
        return ProductService.getNewestProduct(req, res);
    }
    
}