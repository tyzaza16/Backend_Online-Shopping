import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { User, UserModel } from "../db/model/userModel";
import bcrypt from "bcrypt";
import { ApplicationRole } from "../Constant";
export class RegisterService{
    static async registerGeneral(req : Request, res : Response){
        const dtoResp = new DtoResp();
        const isUser : User | null  = await UserModel.findOne({ email : req.body.email});
        bcrypt.hash(req.body.password, 10, async function(err, hash){
            if(err){
                console.error(err);
                dtoResp.setStatus(HandlerStatus.Failed);
                dtoResp.setMessage("Encrypt Fail");
                return res.status(200).json(dtoResp);
            }else if(isUser){
                dtoResp.setStatus(HandlerStatus.Failed);
                dtoResp.setMessage("Email has exist already");
                return res.status(200).json(dtoResp);
            }else{
                console.log(ApplicationRole.User)
                const user = new UserModel({
                    email: req.body.email,
                    password : hash,
                    // profileName : req.body.profileName,
                    // firstName: req.body.firstName,
                    // lastName: req.body.lastName,
                    // telNo: req.body.telNo,
                    // address: req.body.address,
                    role: ApplicationRole.User,
                    // likeProduct: req.body.likeProduct,
                    // cart : req.body.cart,
                    // waitingPayment: req.body.waitingPayment,
                    // transportDetail: req.body.transportDetail,
                })
                await user.save();
                dtoResp.setStatus(HandlerStatus.Success);
                dtoResp.setMessage("Register general success")
                return res.status(200).json( dtoResp );
            }
        })
    }
}
