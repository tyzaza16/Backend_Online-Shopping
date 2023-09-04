import { NextFunction, Request,Response } from "express";
import { get, controller, post, bodyValidator } from './decorators';
import bodyParser from "body-parser";
import { LoginService } from "../service/LoginService";


@controller('/auth')
class AuthController {
  
  @post('/login')
  @bodyValidator('email','password')
  postLogin(req: Request, res: Response):void {
    const loginService = new LoginService();
    loginService.logginInService(req,res);
  }

  // @post('/login')
  // @bodyValidator('email', 'password') 
  // postLogin(req: Request, res: Response) {
  //   const { email, password } = req.body;

  //   if(email === 'test@mail.com' && password === 'test1234') {
  //     req.session = { loggedIn: true};
  //     res.redirect('/');
  //   }
  //   else {  
  //     res.send('Invalid email or password');
  //   }
  // }

  // @get('/logout')
  // getLogout(req: Request, res: Response) {
  //   req.session = undefined;
  //   res.redirect('/');
  // }
}