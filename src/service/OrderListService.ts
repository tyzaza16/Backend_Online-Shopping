// import { Request, Response } from "express";
// import { DtoResp } from "../common/model/DataObjResp";
// import { HandlerStatus } from "../Constant";
// import { Transaction, TransactionModel } from "../db/model/transactionModel";


// interface OrderListUser extends Transaction {
//   userOrderList: {
//     productId: string,
//     status: string,
//     quantity: number,
//     amount: number,
//     transactionIdRef: string,
//   }[]
// }

// export class OrderListService {

//   async getOrderListOfUser(email: string, res: Response): Promise<Response> {

//     const dtoResp: DtoResp = new DtoResp();
//     dtoResp.setStatus(HandlerStatus.Failed);
    
//     const userOrderList: OrderListUser[] = TransactionModel.aggregate([
//       {
//         $match: {
//           email: email
//         }
//       }
//     ]);
//   }

// }