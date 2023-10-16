
/* Request Response Status */
export const HandlerStatus: IHandlerStatus = {
  Success: true,
  Failed: false
};

export interface  IHandlerStatus {
  Success: boolean,
  Failed: boolean,
}



/* Mail Configuration */

export const MAIL_TIMEOUT = 3;


export enum Application {
  Host = 'http://localhost',
  Name = 'CAT HOUSE'
}

export enum Server {
  Host = 'http://localhost',
  Name = 'CAT HOUSE SERVER'
}

export enum FrontEnd {
  Port = 3000,
  AccountPage = '/Account'
}

export enum BackEnd {
  Port = 4000,
  AccountPage = '/Account'
}

export enum TransportStatus {
  Prepare = 'prepared',
  Transport = 'transport',
  Cancel = 'cancel',
  Delivered = 'delivered'
}

export type transporter = TransportStatus; 

export enum ApplicationRole {
  User = 'user',  
  Merchant = 'merchant'
}