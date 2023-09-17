import { HydratedDocument } from "mongoose";
import { Transaction, TransactionModel } from "../db/model/transactionModel";


export class TransactionService {
  
  static async createTransaction(email: string, productId: string, totalAmount: number ): Promise<Transaction | null >{
    
    const newTransaction: HydratedDocument<Transaction> = new TransactionModel({
      email,
      productId,
      totalAmount,
      timestamp: new Date()
    });

    try {
      await newTransaction.save();
      return newTransaction;
    }
    catch(err) {
      return null;
    } 

  }

}