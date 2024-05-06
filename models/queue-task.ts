export interface QueueTask {
  kvNamespace: string;
  msg: Msg;
}

export interface Msg {
  queueName: string;
  data: {
    dataObj: any;
    closeTime: number;
  };
}
