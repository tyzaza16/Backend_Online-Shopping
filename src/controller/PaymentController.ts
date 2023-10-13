import { Request, Response } from "express";
import { CreditCardService } from "../service/CreditCardService";
import { bodyValidator, controller, post } from "./decorators";
import { DtoResp } from "../common/model/DataObjResp";
import { ProductService } from "../service/ProductService";
import { TransactionService } from "../service/TransactionService";
import { TransportStatus } from "../Constant";
import { TransactionResp } from '../db/model/TransactionResp';

@controller('/payment')
class PaymentController {

  @post('/credit_card')
  @bodyValidator(
    'email',
    'productList',
    'cardNumber','expirationDate', 'holderName', 'cvcCode', 'amount', 'address')
  async creditCard(req: Request, res: Response): Promise<Response> {

    /* payment */
    const creditCardService: CreditCardService = new CreditCardService();
    const paymentResult: DtoResp = await creditCardService.createTransaction(req, res);

    if(!paymentResult.getStatus()) {
      return res.status(200).json( paymentResult );
    }

    /* update quantity */
    const productService: ProductService = new ProductService();
    const updateQuantity: DtoResp = await productService.updateQuantityOfProducts(
      req.body.productList
    );

    if(!updateQuantity.getStatus()) {
      return res.status(200).json( updateQuantity );
    }

    /* create transaction and return response */
    const transactionService: TransactionService = new TransactionService();
    const newTransactionResp: TransactionResp  =  await transactionService.createTransaction(
      req.body.email,
      req.body.productList,
      req.body.amount,
      true,
      req.body.address
    );

    if(!newTransactionResp.getStatus()) {
      return res.status(200).json( newTransactionResp ); 
    }

    /* update bought product to transporter */
    const addProductToMerchant: DtoResp = await productService.updateBoughtProductToMerchant(
      req.body.email,
      req.body.productList,
      newTransactionResp.getTransactionId()
    );

    if(!addProductToMerchant.getStatus()){
      newTransactionResp.setMessage(addProductToMerchant.getMessage());
      newTransactionResp.setTransactionStatusObj(false);
      res.status(200).json( newTransactionResp );
    }

    return res.status(200).json( newTransactionResp );

  }


  // createTransaction(req: Request, res: Response): Promise<Response> {
  //   const transactionService = new TransactionService();
  //   return transactionService.createTransaction()
  // }


}