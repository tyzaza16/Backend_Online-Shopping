import 'reflect-metadata';
import { Methods } from './Methods';
import { MetaDataKeys } from './MetaDataKeys';
import { RequestHandler } from 'express';

// we use decorator in props or attribute levels 
// target that we want it 'target'
// bacause attrs/props is in prototype not outside like class level
// that we must tell them use target.prototype


// but if we use decorator in class levels
// target that we want it 'target.prototype'
// because it outside and see contructor and prototype

// craete and interface for us to applied the function in the class
// must have value of properties extends from RequestHandler (req, response)
interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler;
}


function routeBinder(method: string) {
  return function (path: string) {
    return function(target: any, key: string, desc: RouteHandlerDescriptor) {
      Reflect.defineMetadata(
        MetaDataKeys.path, 
        path, 
        target, 
        key
      );
      Reflect.defineMetadata(
        MetaDataKeys.method, 
        method, 
        target, 
        key
      );
    }
 }
}

export const get = routeBinder(Methods.get);
export const put = routeBinder(Methods.put);
export const post = routeBinder(Methods.post);
export const del = routeBinder(Methods.del);