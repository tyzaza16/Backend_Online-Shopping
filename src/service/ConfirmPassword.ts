import { Request, Response } from "express";
import QueryString from "qs";
import { DtoResp } from "../common/model/DataObjResp";
import { Application, FrontEnd, HandlerStatus, MAIL_TIMEOUT } from "../Constant";
import { DateResultsObj, DateUtil } from "../utils/DateUtil";
import { User, UserModel } from "../db/model/userModel";
import bcrypt from 'bcrypt';

type QueryParams = string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];

export class ConfirmPasswordService{

  changePassword(req: Request, res: Response): Promise<void> | Response {

    const { hashedCode, newPassword, timestamp } = req.query;

    if(!hashedCode ||
      !newPassword||
      !timestamp) {
      return res.send(`Properties invalid. props cannot edit`);
    }

    return this.saveNewPassword(hashedCode, newPassword, timestamp, res);
  }

  private async saveNewPassword(
      hashedCode: QueryParams, 
      newPassword: QueryParams, 
      timestamp: QueryParams, 
      res: Response
    ): Promise<void>{
    
    const dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);

    const nowDate: Date = new Date();
    const changePasswordDate: Date = new Date(`${timestamp}`);

    const diffTime: DateResultsObj = DateUtil.getTimeDifference(nowDate, changePasswordDate);

    // check time is more than 3 minutes 
    if( diffTime && (
      diffTime.years > 0 ||
      diffTime.months > 0 ||
      diffTime.days >  0 ||
      diffTime.hours > 0 ||
      diffTime.minutes >= MAIL_TIMEOUT
      )){ // change password not success redirect to account 
        dtoResp.setMessage('Time out please try again.!');
        return res.redirect('/404');
      }

    const hashedNewPassword: string = await bcrypt.hash(newPassword.toString(), 10);

    // time pass less than 3 minutes
    // 1. save new password to database by search hashedcode
    let doc: User | null = await UserModel.findOneAndUpdate(
      { hashedCode },
      { password: hashedNewPassword, hashedCode: null }, 
      { new: true }
    );
    
    if(!doc) {
      return res.redirect('/404');
    }

    // 3. redirect to account pages
    // dtoResp.setStatus(HandlerStatus.Success);
    // dtoResp.setMessage('Successfuly Changed Password');
    return res.redirect(`${Application.Host}:${FrontEnd.Port}${FrontEnd.AccountPage}`);
  }
}
