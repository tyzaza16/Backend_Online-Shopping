import { Response, Request } from "express";
import { User, UserModel } from "../db/model/userModel";
import mongoose from "mongoose";
import { HandlerStatus } from "../Constant";



export class LoginService{ 
  
  logginInService(req: Request,res: Response): void {
    // validate
    this.validate(req,res);
    this.loggingIn(req,res);
  }

  private async loggingIn(req: Request, res: Response) {


    // 1. check email is exist in database
    const user: mongoose.Model<User> | null = await UserModel.findOne({email: 'party'});


    if(!user){
      return res.status(422).json({status: HandlerStatus.SUCCESS, });
    }
    
    // 2. check password is match
    // 3. return status true and send email back

  }

  private validate(req: Request, res: Response){

  }

}