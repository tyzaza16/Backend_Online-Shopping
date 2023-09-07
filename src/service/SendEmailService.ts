import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";


export class SendEmailService {

  sendConfirmPassword(req: Request, res: Response): Promise<Response> | Response{
    this.validate();
    return this.sendEmail(req, res);
  }


  private sendEmail(req: Request, res: Response): Promise<Response> | Response {
    
    let dtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Success);

    // 1. create mailgen (with button)

    let MailGenerator = '';


    // 2. send email to user(with node milar)


    return res.json( dtoResp );
  }

  private validate() {
    
  }

}