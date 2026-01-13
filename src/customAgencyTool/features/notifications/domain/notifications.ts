export interface InterfaceReceive {
    uid: string;
    name: string;
    email: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  url: string;
  urlName: string;
  sender: InterfaceReceive;
  receiver: InterfaceReceive[];
  searchTerms: string[];
}
