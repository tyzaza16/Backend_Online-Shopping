import { Request, Response } from "express";
import { CreditCardService } from "../service/CreditCardService";
import { bodyValidator, controller, post } from "./decorators";
import { DtoResp } from "../common/model/DataObjResp";

@controller('/payment')
class PaymentController{

  @post('/credit_card')
  @bodyValidator(
    'email',
    'productList',
    'cardNumber','expirationDate', 'holderName', 'cvcCode', 'amount')
  async creditCard(req: Request, res: Response): Promise<Response | null > {

    const creditCardService = new CreditCardService();
    const paymentResult: DtoResp = await creditCardService.createTransaction(req, res);

    // check payment pass or not ?
    if(!paymentResult.getStatus) {
      return res.status(402).json( paymentResult );
    }

    
    return null;

  }


  // createTransaction(req: Request, res: Response): Promise<Response> {
  //   const transactionService = new TransactionService();
  //   return transactionService.createTransaction()
  // }


}