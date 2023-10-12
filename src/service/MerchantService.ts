import { Request, Response } from 'express';
import { DtoResp } from '../common/model/DataObjResp';
import { HandlerStatus } from '../Constant';
import { Transaction, TransactionModel } from '../db/model/transactionModel';
import { Product } from '../db/model/productModel';
import { ObjectId } from 'mongoose';
import { User, UserModel } from '../db/model/userModel';

interface MonthlyProfitResp {
  month: number;
  totalProfit: number;
  totalOrder: number;
}

interface MonthlyCustomerResp {
  month: number;
  totalCustomer: number;
}

interface ProductListJoinDetail {
    productId: ObjectId,
    quantity: number,
    merchantEmail: string,
    productDetail: Product
}


export class MerchantService {

  async getDashboard(req: Request, res: Response): Promise<Response> {

    const dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('Successfuly get data!.');

    const merchatEmail: string = req.body.merchantEmail;
    
    const monthlyProfitResp: MonthlyProfitResp = await this.getMonthlyProfit(merchatEmail);
    const monthlyCustomerResp: MonthlyCustomerResp = await this.getCustomerPerMonth(merchatEmail);

    return res.status(200).json({ ...dtoResp, monthlyProfitResp, monthlyCustomerResp });
  }

  async getMonthlyProfit(merchantEmail: string): Promise<MonthlyProfitResp> {
    
    const currentDate: Date = new Date();
    const currentMonth: number = currentDate.getMonth()+1;
    let totalProfit: number = 0;
    let totalOrder: number = 0;

    const monthlyTransaction: ProductListJoinDetail[] = await TransactionModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
                { $month: "$timestamp" },
                currentMonth
            ]
          }
        }
      },
      {
        $match: {
          productList: { $elemMatch: { merchantEmail: merchantEmail }}
        }
      },
      {
        $unwind: '$productList'
      },
      {
        $lookup: 
          {
            from: "products",
            localField: "productList.productId",
            foreignField: "_id",
            as: "productList.productDetail"
          }
      },
      {
        $unwind: '$productList.productDetail'
      },
      {
        $unset: 
        [
          "productList.productDetail.productImage",
          "productList.productDetail.quantity",
          "productList.productDetail.productId",
          "productList.productDetail.productName",
          "productList.productDetail.brandName",
          "productList.productDetail.merchantEmail"
        ]
      },
      {
          $group: {
              _id: '$productList._id',
              productList: {
                  $push: '$productList'
              }
          }
      },
      {
        $unwind: "$productList"
      },
      {
          $replaceRoot: {
              newRoot: '$productList'
          }
      },
      // {
      //   $group: {
      //       _id: '$productList._id',
      //       productList: {
      //           $push: '$productList'
      //       }
      //   }
      // },
      // {
      //     $lookup: {
      //         from: 'transactions',
      //         localField: '_id',
      //         foreignField: '_id',
      //         as: 'transactionDetails'
      //     }
      // },
      // {
      //     $unwind: '$transactionDetails'
      // },
      // {
      //     $addFields: {
      //         'transactionDetails.productList': '$productList'
      //     }
      // },
      // {
      //     $replaceRoot: {
      //         newRoot: '$transactionDetails'
      //     }
      // }
    
    ]);

    console.log(monthlyTransaction);

    if( monthlyTransaction.length === 0 ) {
      return { month: currentMonth, totalProfit, totalOrder };
    }

    let order: ProductListJoinDetail;

    // for(transaction of monthlyTransaction) {

    //   for(let customerOrder of transaction.productList) {
    //     if(customerOrder.merchantEmail === merchantEmail) {
    //       totalProfit += customerOrder.quantity * 
    //       (customerOrder.productDetail.price - customerOrder.productDetail.netCost);
    //     }
    //   }

    // }

    for(order of monthlyTransaction) {

      if(order.merchantEmail === merchantEmail) {
        totalProfit += order.quantity * 
        (order.productDetail.price - order.productDetail.netCost);
        totalOrder++;
      }

    }

    return { month: currentMonth, totalProfit, totalOrder };

  }

  async getCustomerPerMonth(merchantEmail: string): Promise<MonthlyCustomerResp>{
    const currentDate: Date = new Date();
    const currentMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const totalCustomer: number = await TransactionModel.find(
      { 
        productList: { $elemMatch: {merchantEmail: merchantEmail}}, 
        timestamp: {$gte: currentMonthDate},
      })
    .distinct('email')
    .count();

    return { month: currentDate.getMonth()+1, totalCustomer};
  }

  async getUnprepareOrder(merchantEmail: string, res: Response): Promise<Response> {

    const dtoResp: DtoResp = new DtoResp();
    dtoResp.setStatus(HandlerStatus.Failed);


    const unprepareOrder: User[] = await UserModel.aggregate([
      {
        $match: {
          email: merchantEmail
        }
      },
      {
        $unwind: "$orderList"
      },
      {
        $lookup: {
          from: "products",
          localField: "orderList.productId",
          foreignField: "_id",
          as: "orderList.productDetail"
        }
      },
      {
        $unwind: "$orderList.productDetail"
      },
      {
        $unset: [
          "orderList.productDetail.productImage",
          "orderList.productDetail.productId",
          "orderList.productDetail.quantity",
          "orderList.productDetail.netCost",
          "orderList.productDetail.merchantEmail",
        ]
      },
      {
        $group:{
          _id: "$orderList.transactionIdRef",
          productDetail: {
            $push: "$orderList"
          },
          totalAmount: {
            $sum: "$orderList.amount"
          }
        }
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "_id",
          as: "transactionDetail"
        }
      },
      {
        $unwind: "$transactionDetail"
      },      
      {
        $unset: [
          "transactionDetail.productList",
          "transactionDetail.status",
        ]
      },
    ]);

    if(!unprepareOrder) {
      dtoResp.setMessage('user not found in database!.');
      return res.status(200).json({ ...dtoResp, orderList: unprepareOrder});
    }


    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('Successfuly get data!.');
    return res.status(200).json({ ...dtoResp, orderList: unprepareOrder});

  }



}