import { NextFunction, Request, Response } from "express";
import { get, controller, post, bodyValidator} from './decorators';
import {RegisterService} from "../service/RegisterService"

@controller('/register')
class RegisterController {
    @post('/general')
    postRegister(req: Request, res: Response){
        RegisterService.registerGeneral(req, res);
    }

    @post('/google')
    get(req: Request, res: Response){
        res.send('Welcome to API Home...');
    }
}