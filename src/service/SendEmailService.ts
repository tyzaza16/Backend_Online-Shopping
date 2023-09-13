import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { Application, HandlerStatus } from "../Constant";
import { NodeForge } from "../utils/NodeForge";
import { User, UserModel } from "../db/model/userModel";
import { MailGenerator } from "../utils/MailGenerator";
import { EMAIL_USERNAME, SERVER_PORT } from "../utils/loadEnvirontment";
import Mailgen, { Content } from "mailgen";
import { NodeMailer } from "../utils/NodeMailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


interface allowedUserChangePassword {
  password: string;
  newPassword: string;
}

export class SendEmailService {

  sendConfirmPassword(req: Request, res: Response): Promise<Response> | Response{

    const email: string = req.body.email;
    const updateObj: allowedUserChangePassword = JSON.parse(req.body.updateObj);

    if(!this.validate(updateObj)) {
      return res.send(`Properties invalid. props cannot edit`);
    }
    
    return this.sendEmail(email, updateObj, res);
  }


  private async sendEmail(email: string, updateObj: allowedUserChangePassword, res: Response): Promise<Response> {
    
    let dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);


    // 1. create hashed code and DateTime and save it into collection 
    const hashedCode: string = NodeForge.hashWithSHA258(email);
    const timestamp: Date = new Date();

    const doc: User | null = await UserModel.findOneAndUpdate({ email }, { hashedCode }, {
      new: true
    }); 

    
    // not found user in database
    if(!doc) {
      dtoResp.setMessage('Not found user in database!.');
      return res.status(422).json( dtoResp );
    }

    // password input not matched database password  
    if(updateObj.password !== doc.password) {
      dtoResp.setMessage('Password Not Matched!.');
      return res.status(422).json( dtoResp );
    }


    // 2. create mailgen (with button)
    let mailGenerator: Mailgen = MailGenerator.initMailGenerator();

    let mailBody: Content = {
      body: {
        name: doc.profileName,
        intro: 'Please confirm your new password change.',
        action: {
          instructions: 'by click the button below!',
          button: {
            color: '#77dd77',
            text: 'Confirm new password',
            link: `
              ${Application.Host}:${SERVER_PORT}/user/confirm_password?hashedCode=${hashedCode}&newPassword=${updateObj.newPassword}&timestamp=${timestamp.toUTCString()}
            ` 
          }
        }

      }
    };

    let mail = mailGenerator.generate(mailBody);

    // 3. send email to user(with nodemailer)
    try {
      const info: SMTPTransport.SentMessageInfo = await NodeMailer.sendMail({
        from: EMAIL_USERNAME,
        to: doc.email,
        subject: 'Confirm Password Change',
        html: mail, 
      });

      dtoResp.setStatus(HandlerStatus.Success);
      dtoResp.setMessage('Email Sent!.');
      return res.status(200).json({ ...dtoResp, info: info.messageId})
      
    } catch (error) {
      dtoResp.setMessage(`${error}`);
      return res.status(200).json( dtoResp );
    }

  }

  private validate(updateObj: allowedUserChangePassword): boolean{
    if(
        !updateObj.newPassword || 
        !updateObj.password
      ){
        return false;  
      }

    return true;

  }

}