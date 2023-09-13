import { Request, Response } from 'express';
import { User, UserModel } from '../db/model/userModel';
import { DtoResp } from '../common/model/DataObjResp';
import { HandlerStatus } from '../Constant';

interface allowedUserUpdate {
  profileName?: string;
  telNo?: number;
}


export class UpdateAccountService{
  
  updateAccount(req: Request, res: Response): Promise<Response> | Response {

    const email: string = req.body.email;
    const updateObj: allowedUserUpdate = JSON.parse(req.body.updateObj);

    if(!this.validate(updateObj)) {
      return res.send(`Properties invalid. props cannot edit`);
    }

    return this.updatingAccount(email, updateObj, res);
  }

  private async updatingAccount(email: string, updateObj: allowedUserUpdate, res: Response): Promise<Response> {


    let doc: User | null = await UserModel.findOneAndUpdate(
      { email }, 
      updateObj, 
      { new: true }
    );

    let dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);

    if(!doc) {
      dtoResp.setMessage('user not found in the collection');
      return res.status(422).json( dtoResp );
    }

    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('update success!.');
    return res.status(200).json( { ...dtoResp, user: doc} );

  }

  private validate(updateObj: allowedUserUpdate): boolean {
    
    console.log(updateObj);

    if( !updateObj.telNo &&
        !updateObj.profileName
      ){
      return false;
    }

    return true;

  }
  
}