import { Request, Response } from "express";
import { controller, post} from './decorators';
import {RegisterService} from "../service/RegisterService"


@controller('/register')
class RegisterController {
    @post('/general')
    postRegister(req: Request, res: Response){
        RegisterService.registerGeneral(req, res);
    }

}