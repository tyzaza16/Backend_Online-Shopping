import { NextFunction, Request, Response } from "express";
import { get, controller, post, bodyValidator} from './decorators';
import bodyParser from "body-parser";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
// import {RegisterService} from "../service/LoginService"
import { UserModel, User } from "../db/model/userModel";

@controller('/register')
class RegisterController {
    @post('/general')
    async postRegister(req: Request, res: Response){
        const dtoResp = new DtoResp();
        const isUser : User | null  = await UserModel.findOne({ email : req.body.email});
        console.log("result = " , isUser)
        if(isUser){
            dtoResp.setStatus(HandlerStatus.Failed);
            dtoResp.setMessage("Email has exist already");
            res.status(422).json(dtoResp);
        }else{
            const user = new UserModel({
                email: req.body.email,
                password : req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                telNo: req.body.telNo,
                address: req.body.address,
                role: req.body.role,
                likeProduct: req.body.likeProduct,
                waitingPayment: req.body.waitingPayment,
                transportDetail: req.body.transportDetail,
            })
            await user.save();
            dtoResp.setStatus(HandlerStatus.Success);
            dtoResp.setMessage("Register general success");
            res.status(200).json( dtoResp );
        }
    }

    @post('/google')
    get(req: Request, res: Response){
        res.send('Welcome to API Home...');
    }
}