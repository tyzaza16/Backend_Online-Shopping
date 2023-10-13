import { DtoResp } from "../../common/model/DataObjResp";
import { Transaction } from "./transactionModel";

export class TransactionResp extends DtoResp{
  private transactionId: string = '';
  private transactionRespObj: Transaction = {
    email: '',
    productList: [],
    address: '',
    timestamp: new Date(),
    totalAmount: 0,
    status: false
  };


  setTransactionStatusObj(status: boolean): void {
    this.transactionRespObj.status = status;
  }

  getTransaction(): Transaction {
    return this.transactionRespObj;
  }

  setTransaction(trasactionObj: Transaction ): void {
    this.transactionRespObj = trasactionObj;
  }

  getTransactionId(): string {
    return this.transactionId;
  }

  setTransactionId(transactionId: string): void {
    this.transactionId = transactionId;
  }

  
}