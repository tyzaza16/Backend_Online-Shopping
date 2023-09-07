import { UpdateAccountService } from "../service/UpdateAccountService";
import { SendEmailService } from "../service/SendEmailService";
import { bodyValidator, controller, post, use } from "./decorators";
import { NextFunction, Request, Response } from "express";
import { NodeMailer } from "../utils/NodeMailer";
import { EMAIL_APP_PASSWORD, EMAIL_USERNAME } from "../utils/loadEnvirontment";

function initNodeMailer(req: Request, res: Response, next: NextFunction) {
  if(!NodeMailer.transporter) {
    NodeMailer.initTransporter({ 
      service: 'gmail',
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_APP_PASSWORD
      }
    });
  }

  next();
  return;
} 


@controller('/user')
class UserController {

  @post('/update')
  @bodyValidator('email', 'updateObj')
  postUpdateProfile(req: Request, res: Response): Promise<Response> | Response{
    const updateAccount = new UpdateAccountService();
    return updateAccount.updateAccount(req, res);
  }
  
  @post('/send_email')
  @use(initNodeMailer)
  postSendEmail(req: Request, res: Response): Promise<Response> | Response{
    const sendEmail = new SendEmailService();
    return sendEmail.sendConfirmPassword(req, res);

  }

  
}