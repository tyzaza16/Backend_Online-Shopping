import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { Transaction } from "../db/model/transactionModel";


interface OrderListUser extends Transaction {
  userOrderList: {
    
  }
}

export class OrderListService {

  async getOrderListOfUser(email: string, res: Response): Promise<Response> {

    const dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);
    
    const userOrderList: OrderListUser = 
  }

}