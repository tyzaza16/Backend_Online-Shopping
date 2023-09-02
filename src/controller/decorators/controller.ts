import 'reflect-metadata';
import { AppRouter } from '../../AppRouter';
import { Methods } from './Methods'; 
import { MetaDataKeys } from './MetaDataKeys';
import { NextFunction, RequestHandler, Request, Response} from 'express';

function bodyValidators(keys: string): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction){

    if(!req.body) {
      res.status(422).send('Invalid properties');
      return;
    }


    for(let key of keys) {
      if(!req.body[key]) {
        res.status(422).send(`Invalid Properties ${key}`);
        return;
      }
    }

    next();
  }
}

export function controller(routePrefix: string) {
  return function(target: Function) {
    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      const router = AppRouter.getInstance();

      const routeHandler = target.prototype[key];
      
      const path = Reflect.getMetadata(
        MetaDataKeys.path, 
        target.prototype, 
        key
      );
      const method: Methods = Reflect.getMetadata(
        MetaDataKeys.method, 
        target.prototype, 
        key
      );
      const middlewares = Reflect.getMetadata(
        MetaDataKeys.middleware, 
        target.prototype, 
        key
      ) || []; // handle with empthy arr[]

      const requiredBodyValidator = Reflect.getMetadata(
        MetaDataKeys.validator,
        target.prototype,
        key
      )  || [];

      const validator = bodyValidators(requiredBodyValidator);

      if(path) {
        router[method](`${routePrefix}${path}`, ...middlewares, validator,routeHandler);
      }
    });
  }
}



// so from bodyvalidator is use for save properties as @bodyvalidator('email','password')
// and then we call in on controller @controller('/auth')
// and in decorators factory is used for check every argument that contain in bodyvalidators 
// by get all store in and arr requiredBodyValidator and put it in bodyValidator function to check prop is exist