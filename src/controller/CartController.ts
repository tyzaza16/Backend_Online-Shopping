import {post, get, controller } from "./decorators";
import { Request, Response } from "express";
import { CartService } from "../service/CartService";

@controller('/cart')
class CartController{
    @post('/addCart')
    addCart(req : Request, res : Response){
        CartService.addCart(req, res);
    }

    @post('/deleteCart')
    delete(req : Request, res : Response){
        CartService.deleteCart(req, res);
    }

    @post('/getDataCart')
    getData(req : Request, res : Response){
        CartService.getCart(req, res);
    }
    
    @post('/updateAmount')
    updateAmount(req : Request, res : Response){
        CartService.updateAmount(req, res);
    }
}