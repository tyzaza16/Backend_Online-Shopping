import { HydratedDocument } from "mongoose";
import { Transaction, TransactionModel } from "../db/model/transactionModel";
import { updateQuantity } from "../db/model/transactionModel";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { Response } from "express";

export class TransactionService {
  
  async createTransaction(email: string, productId: updateQuantity[], totalAmount: number, res: Response): Promise<Response>{
    
    const dtoResp: DtoResp = new DtoResp();

    const newTransaction: HydratedDocument<Transaction> = new TransactionModel({
      email,
      productId,
      totalAmount,
      timestamp: new Date(),
    });

    try {
      await newTransaction.save();
      dtoResp.setStatus(HandlerStatus.Success);
      dtoResp.setMessage('Create transaction Success!.');
      return res.status(200).json({ ...dtoResp, transaction: newTransaction});
    }
    catch(err) {
      dtoResp.setStatus(HandlerStatus.Failed);
      dtoResp.setMessage('Create transaction failed!.');
      return res.status(422).json({ ...dtoResp, })
    } 

  }

}