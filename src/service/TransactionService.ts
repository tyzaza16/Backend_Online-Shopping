import { HydratedDocument } from "mongoose";
import { Transaction, TransactionModel } from "../db/model/transactionModel";
import { updateQuantity } from "../db/model/transactionModel";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus, transporter } from "../Constant";
import { Response } from "express";
import { IAddress } from "../db/model/userModel";
import { TransactionResp } from "../db/model/TransactionResp";

export class TransactionService {
  
  async createTransaction(
    email: string, 
    productList: updateQuantity[], 
    totalAmount: number,
    status: boolean,
    address: IAddress): Promise<TransactionResp>{
    
    const transactionResp: TransactionResp = new TransactionResp();

    const newTransaction: HydratedDocument<Transaction> = new TransactionModel({
      email,
      productList,
      totalAmount,
      status,
      address,
      timestamp: new Date(),
    });

    try {
      await newTransaction.save();
      transactionResp.setStatus(HandlerStatus.Success);
      transactionResp.setMessage('Create transaction Success!.');
      transactionResp.setTransactionId(newTransaction._id.toString());
      transactionResp.setTransaction(newTransaction);
      return transactionResp;
    }
    catch(err) {
      transactionResp.setStatus(HandlerStatus.Failed);
      transactionResp.setMessage('Create transaction failed!.');
      return transactionResp;
    } 

  }

}