
export interface InterfaceReceive {
  uid: string;
  name: string;
  email: string;
}

export interface Notification {
  uid: string;
  title: string;
  message: string;
  isRead: boolean;
  date: Date;
  url: string;
  urlName: string;

  sender: InterfaceReceive;
  receiver: InterfaceReceive[];

  searchTerms: string[];
}
