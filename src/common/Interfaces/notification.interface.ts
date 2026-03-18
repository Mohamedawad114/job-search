
export interface INotification {
  userId:number;
  title: string;
  content: string;
  isRead: boolean;
}

export interface INotificationData{
  companyName?: string
  jobTitle?: string
  maxCount?:number
}