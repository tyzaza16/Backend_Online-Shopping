import { NextFunction, Request, Response } from "express";
import { get, controller, post, bodyValidator} from './decorators';
import bodyParser from "body-parser";
// import {RegisterService} from "../service/LoginService"

@controller('/register')
class RegisterController {
    @post('/')
    postRegister(req: Request, res: Response){
        res.json()
    }
}