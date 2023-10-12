import { Request, Response } from 'express';
import { ProductService } from "../service/ProductService";
import { bodyValidator, controller, post } from "./decorators";
import { MerchantService } from '../service/MerchantService';


@controller('/merchant')
class BackOfficeController {

  @post('/dashboard')
  @bodyValidator('merchantEmail')
  postMerchantDashBoard(req: Request, res: Response): Promise<Response>{

    const merchantService: MerchantService = new MerchantService();
    return merchantService.getDashboard(req, res);
  }

  @post('/add_stock_product')
  @bodyValidator('email','productList')
  postAddStockOfProduct(req: Request, res: Response): Promise<Response>{
     
    const productService: ProductService = new ProductService();
    return productService.addStockOfProduct(req.body.email, req.body.productList, res);
  }

  @post('/get_warehouse_history')
  @bodyValidator('email')
  postWareHouseHistory(req: Request, res: Response): Promise<Response> {
      
    const productService: ProductService = new ProductService();
    return productService.getWareHouseHistory(req.body.email, res);
  }

  @post('/get_merchant_orders')
  @bodyValidator('merchantEmail')
  postGetMerchantOrders(req: Request, res: Response): Promise<Response>{
    const merchantService: MerchantService = new MerchantService();
    return merchantService.getUnprepareOrder(req.body.merchantEmail, res);
  }
}