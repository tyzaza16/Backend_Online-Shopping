import { UpdateAccountService } from "../service/UpdateAccountService";
import { SendEmailService } from "../service/SendEmailService";
import { bodyValidator, controller, post, use, get } from "./decorators";
import { NextFunction, Request, Response } from "express";
import { NodeMailer } from "../utils/NodeMailer";
import { EMAIL_APP_PASSWORD, EMAIL_USERNAME } from "../utils/loadEnvirontment";
import { ConfirmPasswordService } from "../service/ConfirmPassword";
import { UpdateAddressService } from "../service/UpdateAddressService";
import { GetInfoService } from "../service/GetInfoService"; 

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

  @post('/get_user')
  @bodyValidator('email')
  postGetUser(req: Request, res : Response) : Promise<Response> | Response{
    const getInfo = new GetInfoService();
    return getInfo.getUserData(req, res);
  }

  @post('/update')
  @bodyValidator('email', 'updateObj')
  postUpdateProfile(req: Request, res: Response): Promise<Response> | Response{
    const updateAccount = new UpdateAccountService();
    return updateAccount.updateAccount(req, res);
  }
  
  @post('/send_email')
  @bodyValidator('email', 'updateObj')
  @use(initNodeMailer)
  postSendEmail(req: Request, res: Response): Promise<Response> | Response {
    const sendEmail = new SendEmailService();
    return sendEmail.sendConfirmPassword(req, res);

  }

  @get('/confirm_password')
  getConfirmEmail(req: Request, res: Response): Promise<void> | Response{
    const confirmPassword = new ConfirmPasswordService();
    return confirmPassword.changePassword(req, res);
  }

  // get, add, update, delete address
  // get => use user service get all information
  @post('/create_address')
  @bodyValidator('email', 'updateObj')
  postAddAddress(req: Request, res: Response): Promise<Response> | Response{
    const updateAddress = new UpdateAddressService();
    return updateAddress.addAddress(req, res);
  }

  @post('/update_address')
  @bodyValidator('updateObj')
  postUpdateAddress(req: Request, res: Response): Promise<Response> | Response{
    const updateAddress = new UpdateAddressService();
    return updateAddress.updateAddress(req, res);
  }

  @post('/del_address')
  @bodyValidator('_id')
  postDeleteAddress(req: Request, res: Response): Promise<Response> | Response {
    const deleteAddress = new UpdateAddressService();
    return deleteAddress.deleteAddress(req, res);
  }

  
}