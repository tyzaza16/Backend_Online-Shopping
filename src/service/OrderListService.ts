import { Request, Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { Transaction, TransactionModel } from "../db/model/transactionModel";


interface OrderListUser extends Transaction {
  userOrderList: {
    productId: string,
    status: string,
    quantity: number,
    amount: number,
    transactionIdRef: string,
  }[]
}

export class OrderListService {

  async getOrderListOfUser(email: string, res: Response): Promise<Response> {

    const dtoResp: DtoResp = new DtoResp();
    
    const userOrderList: OrderListUser[] = await TransactionModel.aggregate([
      {
        $match: {
          email: email
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'orderList.transactionIdRef',
          as: 'orderDetail'
        }
      },
      {
        $unset: [
          "orderDetail._id",
          "orderDetail.email",
          "orderDetail.password",
          "orderDetail.profileName",
          "orderDetail.address",
          "orderDetail.role",
          "orderDetail.likeProduct",
          "orderDetail.cart",
          "orderDetail.waitingPayment",
          "orderDetail.__v",
          "orderDetail.telNo",
          "orderDetail.hashedCode"
        ]
      }, 
      {
        $unwind: "$orderDetail"
      },
      {
        $unwind: "$orderDetail.orderList"
      },
      {
        $group: {
          _id: "$_id",
          orderDetail: {
            $push: {
              $cond: [
                {$eq: ["$orderDetail.orderList.transactionIdRef","$_id"],},
                "$orderDetail.orderList",
                null
              ]
            }
          },
          address:{
            $first: "$address"
          },
          totalAmount:{
            $first: "$totalAmount"
          }
        }  
      },
      {
        $addFields: {
          orderDetail: {
                $filter: {
                    input: "$orderDetail",
                    as: "orderItem",
                    cond: {
                        $ne: [ "$$orderItem", null ]
                    }
                }
            }
        }
      },
      {
        $unwind: "$orderDetail"
      },
      {
        $lookup: {
          from: "products",
          localField: 'orderDetail.productId',
          foreignField: '_id',
          as: 'orderDetail.productDetail'
        }
      },
      {
        $unset: "orderDetail.productDetail.productImage",
      },
      {
        $unwind: "$orderDetail.productDetail",
      },
      {
        $group: {
          _id: "$_id",
          orderDetail: {
            $push: "$orderDetail"
          },
          address:{
            $first: "$address"
          },
          totalAmount:{
            $first: "$totalAmount"
          }
        }
      },
      {
        $sort: {_id: 1}
      }
    ]);

    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('Successfully get order!.');
    return res.status(200).json({ ...dtoResp, userOrderList });
  }

}

