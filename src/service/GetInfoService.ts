import { Response, Request } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { HydratedDocument } from "mongoose";
import { User, UserModel } from "../db/model/userModel";

export class GetInfoService {
    async getUserData( req: Request, res: Response) : Promise<Response>{
        const dtoResp = new DtoResp();
        const user : HydratedDocument<User> | null  = await UserModel.findOne({ email : req.body.email});
        if(!user){
            dtoResp.setStatus(HandlerStatus.Failed);
            dtoResp.setMessage("Email doesn't exist in system")
            return res.status(200).json(dtoResp);
        }
        dtoResp.setStatus(HandlerStatus.Success)
        dtoResp.setMessage("get user data success")
        return res.status(200).json({...dtoResp, user});// Status : dtoResp.Status
    }
}