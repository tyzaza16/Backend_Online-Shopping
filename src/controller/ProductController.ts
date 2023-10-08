import {post, controller, bodyValidator } from "./decorators";
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
    
}