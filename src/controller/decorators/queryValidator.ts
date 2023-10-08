import 'reflect-metadata';
import { MetaDataKeys  } from "./MetaDataKeys";

export function queryValidator(...keys: string[]) {
  return function(target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetaDataKeys.queryValidator, keys, target, key )
  }
}