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

    @post('/searchProduct')
    getData(req : Request, res : Response){
        ProductService.searchProduct(req, res);
    }

    @get('/suggest_product')
    suggestProduct(req: Request, res: Response) {
        return ProductService.suggestProduct(res);
    }

    @get('/best_selling')
    bestSellingProduct(req: Request, res: Response) {
        return ProductService.getBestSeller(res);
    }
    
}