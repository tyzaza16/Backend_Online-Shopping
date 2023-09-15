import { HandlerStatus } from './../Constant';
import { Response, Request } from "express";
import { User, UserModel } from "../db/model/userModel";
import { DtoResp } from "../common/model/DataObjResp";

export class LoginService{ 
  
  logginInService(req: Request,res: Response): Promise<Response> {
    return this.loggingIn(req,res);
  }

  private async loggingIn(req: Request, res: Response): Promise<Response> {

    const email: string = req.body.email;
    const password: string = req.body.password;

    // 1. check email is exist in database
    const user: User | null = await UserModel.findOne({ email });

    let dtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);

    if(!user){
      dtoResp.setMessage('user not exist!.'); 
      return res.status(422).json( dtoResp );
    }

    // 2. check password is match
    if(password !== user.password) { 
      dtoResp.setMessage('password not match');
      return res.status(422).json( dtoResp );
    }

    // 3. return status true and send email back
    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('login successfully');
    return res.status(200).json({ ...dtoResp, user });

  }

}