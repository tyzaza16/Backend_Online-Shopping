import { NextFunction, Request,Response } from "express";
import { get, controller, post, bodyValidator,use } from './decorators';
import { LoginService } from "../service/LoginService";
import passport, { DoneCallback, Profile } from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Application, ApplicationRole, BackEnd, FrontEnd, HandlerStatus, Server } from "../Constant";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/loadEnvirontment";
import { UserModel, User } from "../db/model/userModel";
import { UserService } from "../service/UserService";
import { NodeForge } from "../utils/NodeForge";
import { HydratedDocument } from "mongoose";
import { DtoResp } from "../common/model/DataObjResp";

interface IUser extends User {}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}


passport.use(
  new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${Server.Host}:${BackEnd.Port}/auth/redirect/google`,
    passReqToCallback: true
  }, 
  async (request: Request, accessToken: string, refreshToken: string, profile: Profile, done: DoneCallback) => { 

    if(!profile.emails || !profile.name) {
      return done(null, null);
    }

    const id: string = profile.id;
    const email = profile.emails[0].value ;
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;

    const currentUser: User | null = await UserService.findUserByEmail(email);
    const hash: string = NodeForge.hashWithSHA258(email);
    
    if(!currentUser) {
      const newUser: HydratedDocument<User> = new UserModel({
        email,
        password: hash,
        role: ApplicationRole.User
      });

      await newUser.save();
      return done(null, newUser);
    }

    return done(null, currentUser);

  }
));

passport.serializeUser((user: Express.User, done: DoneCallback) => {
  done(null, user);
});

passport.deserializeUser((user: User, done: DoneCallback) => {
	done(null, user);
});

const googleAuth = passport.authenticate('google');

const googleAuthCall = passport.authenticate('google', {scope: ['email','profile']});


@controller('/auth')
class AuthController {
  
  @post('/login')
  @bodyValidator('email','password','role')
  postLogin(req: Request, res: Response): Promise<Response> {
    const loginService = new LoginService();
    return loginService.logginInService(req,res);
  }

  @get('/google')
  @use(googleAuthCall)
  googleAuth(req: Request, res: Response){}

  @get('/redirect/google')
  @use(googleAuth) 
  googleAuthRedirect(req: Request, res: Response) {
    
    const dtoResp = new DtoResp();
    
    if(!req.user) {
      dtoResp.setStatus(HandlerStatus.Failed);
      dtoResp.setMessage('Login Failed!.');
      return res.status(200).json({ ...dtoResp, user: req.user});
    }

    //save session
    req.session.user = req.user;
    req.session.save( function(err) {
      if(err) {
        console.log(err);
      }
      else {
        return res.redirect(`${Application.Host}:${FrontEnd.Port}`);
      }
    });
  }
  
  @get('/google/success')
  googleLoginSuccess(req: Request, res: Response){

    console.log(req.session.user);
    const dtoResp = new DtoResp();
    
    if(!req.session.user) {
      dtoResp.setStatus(HandlerStatus.Failed);
      dtoResp.setMessage('Unauthorized access!.');
      return res.status(200).json( dtoResp );
    }

    dtoResp.setStatus(HandlerStatus.Success);
    dtoResp.setMessage('Success Login!.');
    return res.status(200).json({ ...dtoResp, user: req.user});

  }

  @get('google/logout')
  googleLogOut(req: Express.Request, res: Response) {
    
    const dtoResp = new DtoResp();

    req.logout(function(err) {
      if(err) {
        dtoResp.setStatus(HandlerStatus.Failed);
        dtoResp.setMessage('You are logged out!.');
        return res.status(200).json( dtoResp );
      }

      dtoResp.setStatus(HandlerStatus.Success);
      dtoResp.setMessage('Success Logout!.');
      return res.status(200).json({ ...dtoResp, user: req.user});
    });

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