import { Request, Response } from "express";
import { CreditCardService } from "../service/CreditCardService";
import { bodyValidator, controller, post } from "./decorators";
import { DtoResp } from "../common/model/DataObjResp";
import { ProductService } from "../service/ProductService";
import { TransactionService } from "../service/TransactionService";

@controller('/payment')
class PaymentController{

  @post('/credit_card')
  @bodyValidator(
    'email',
    'productList',
    'cardNumber','expirationDate', 'holderName', 'cvcCode', 'amount')
  async creditCard(req: Request, res: Response): Promise<Response | null > {

    /* payment */
    const creditCardService: CreditCardService = new CreditCardService();
    const paymentResult: DtoResp = await creditCardService.createTransaction(req, res);

    if(!paymentResult.getStatus()) {
      return res.status(402).json( paymentResult );
    }

    /* update quantity */
    const productService: ProductService = new ProductService();
    const updateQuantity: DtoResp = await productService.updateQuantityOfProducts(
      req.body.productList
    );

    if(!updateQuantity.getStatus()) {
      return res.status(422).json( updateQuantity );
    }

    /* update bought product to user */
    const addProductToUser: DtoResp = await productService.updateBoughtProductToUser(
      req.body.email,
      req.body.productList
    );

    if(!addProductToUser.getStatus()) {
      return res.status(422).json( addProductToUser );
    }

    /* create transaction and return response */
    const transactionService: TransactionService = new TransactionService();
    return transactionService.createTransaction(
      req.body.email,
      req.body.productList,
      req.body.amount,
      res
    );

  }


  // createTransaction(req: Request, res: Response): Promise<Response> {
  //   const transactionService = new TransactionService();
  //   return transactionService.createTransaction()
  // }


}