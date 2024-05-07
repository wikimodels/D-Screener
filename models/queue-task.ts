export interface QueueMsg {
  timeframe: string;
  queueName: string;
  data: {
    dataObj: any;
    closeTime: number;
  };
}
