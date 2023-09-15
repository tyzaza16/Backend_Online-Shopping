import { Request, Response } from "express";
import { IAddress, UserModel, User } from "../db/model/userModel";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";


export class UpdateAddressService{

  addAddress(req: Request, res: Response): Promise<Response> | Response {
    
    const email: string = req.body.email;
    const updateObj: IAddress = JSON.parse(req.body.updateObj);

    if(!this.validateAllProps(updateObj)){
      return res.send(`Properties invalid. props cannot edit`);
    }

    return this.saveNewAddress(email, updateObj, res);
  }


  updateAddress(req: Request, res: Response): Promise<Response> | Response {
  
    const updateObj: IAddress = JSON.parse(req.body.updateObj);


    if(!this.validateSomeProps(updateObj)){
      return res.send(`Properties invalid. props cannot edit`);
    }

    return this.updateAddressById(updateObj, res);
  }

  deleteAddress(req: Request, res: Response): Promise<Response> {
    
    const id: string = req.body._id;
    
    return this.deleteAddressById(id, res);
  }


  private async saveNewAddress(
    email: string, 
    updateObj: IAddress, 
    res: Response): Promise<Response> {
    
    const dtoResp: DtoResp = new DtoResp();

    try {
      const data: User | null = await UserModel.findOneAndUpdate(
        { email },
        { $push: { address: updateObj }},
        { new: true}
      );

      dtoResp.setStatus(HandlerStatus.Success);
      dtoResp.setMessage('Save new address successfuly. bye!');
      return res.status(200).json({ ...dtoResp, user: data});
    } catch (error) {
      dtoResp.setStatus(HandlerStatus.Failed);
      dtoResp.setMessage('Error Cannot save address.');
      return res.status(422).json({ ...dtoResp, error });
    }

  }

  private async updateAddressById(
    updateObj: IAddress, 
    res: Response): Promise<Response> {

      const dtoResp: DtoResp = new DtoResp();

      // create queryString for update existing fields
      const queryObject: { [key:string]: number | string | undefined } = {};
      
      for(const key in updateObj) {
        queryObject[`address.$.${key}`] = updateObj[key as keyof IAddress];
      }

      try {
        const user: User | null = await UserModel.findOneAndUpdate(
          { "address._id": updateObj._id },
          { $set: queryObject }, 
          { new: true }
        );

        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('Update address successfuly. bye!');
        return res.status(200).json({ ...dtoResp, user});
      } catch (error) {
        dtoResp.setStatus(HandlerStatus.Failed);
        dtoResp.setMessage('Error Cannot update address.');
        return res.status(200).json({ ...dtoResp, error });
      }

    }


  private async deleteAddressById(id: string, res: Response): Promise<Response> {
    
    const dtoResp: DtoResp = new DtoResp();

    try {
      
      const user: User | null = await UserModel.findOneAndUpdate(
        { "address._id": id},               //query here does not matter like $set that use for find object
        { $pull: { address: {_id: id} }}, 
        { new: true}
      );

      dtoResp.setStatus(HandlerStatus.Success);
      dtoResp.setMessage('Delete address successful!.');
      return res.status(200).json( { ...dtoResp, user });
    } catch (error) {
      dtoResp.setStatus(HandlerStatus.Failed);
      dtoResp.setMessage('Error! can not delete address');
      return res.status(422).json({ ...dtoResp, error });
    }
  }


  private validateAllProps(updateObj: IAddress): boolean {
    
    if(
        !updateObj.address ||
        !updateObj.code ||
        !updateObj.district ||
        !updateObj.firstName ||
        !updateObj.lastName ||
        !updateObj.province ||
        !updateObj.subDistrict ||
        !updateObj.telNo 
      ) {
        return false;
      }

    return true; 
  }


  private validateSomeProps(updateObj: IAddress): boolean {
    
    if(
        !updateObj.address &&
        !updateObj.code &&
        !updateObj.district &&
        !updateObj.firstName &&
        !updateObj.lastName &&
        !updateObj.province &&
        !updateObj.subDistrict &&
        !updateObj.telNo ||
        !updateObj._id
      ) {
        return false;
      }

    return true; 
  }

}