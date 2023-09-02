import 'reflect-metadata';
import { MetaDataKeys } from './MetaDataKeys';

export function bodyValidator(...keys: string[]) {
  return function(target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetaDataKeys.validator, keys, target, key);
  }
}
