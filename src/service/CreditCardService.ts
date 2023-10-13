import { HydratedDocument } from 'mongoose';
import { Request, Response } from "express";
import { CreditCard, CreditCardModel } from "../db/model/creditCardModel";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";

export class CreditCardService {


  createTransaction(req: Request, res: Response): Promise<DtoResp> {
    return this.pay(req, res);
  }

  
  private async pay(req: Request, res: Response): Promise<DtoResp>{

    const { 
      cardNumber, 
      expirationDate, 
      holderName, 
      cvcCode, 
      amount } = req.body;


    const dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);
      
    const creditCard: HydratedDocument<CreditCard> | null = await CreditCardModel.findOne(
      { cardNumber }
    );


    if(!creditCard) {
      dtoResp.setMessage('Not found credit card!.');
      return dtoResp;
    }

    if(
      expirationDate !== creditCard.expirationDate ||
      cvcCode !== creditCard.cvcCode ||
      holderName !== creditCard.holderName
      ){
      dtoResp.setMessage('Credit card is not correct!.');
      return dtoResp; 
    }

    if(!this.validateExpirationDate(creditCard.expirationDate)) {
      dtoResp.setMessage('Credit card is expire!.');
      return dtoResp;
    }

    if(amount > creditCard.amount) {
      dtoResp.setMessage('Not enough money on the credit card.');
      return dtoResp; 
    }

    try {
      creditCard.amount = creditCard.amount - amount;
      creditCard.save();
    } catch (error) {
      dtoResp.setMessage('Can not save amount to creditcard.');
      return dtoResp;
    }

    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('Payment is successfully.');
    return dtoResp 

  }

  private validateExpirationDate(cardDate: string): boolean {
    const nowDate: Date = new Date();
    const cardDateArray: string[] = cardDate.split('/');
    
    if(  
      nowDate.getFullYear() % 100 > parseInt(cardDateArray[1])
    )
      return false;
    
    if(
      nowDate.getFullYear() % 100 === parseInt(cardDateArray[1]) &&
      nowDate.getMonth()+1 > parseInt(cardDateArray[0])
    ) 
      return false;
      
    
    return true;
  }




}