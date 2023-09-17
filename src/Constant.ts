
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

export enum FrontEnd {
  Port = 3000,
  AccountPage = '/Account'
}

export enum TransportStatus {
  Prepare = 'prepared',
  Transport = 'transport',
  Cancel = 'cancel',
  Delivered = 'delivered'
}