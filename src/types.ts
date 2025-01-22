export type OrderState =
  | "UNPAID"
  | "PENDING"
  | "READY_TO_SHIP"
  | "GETTING_SHIPPING_PARAMS"
  | "SHIP_ORDER_REQUESTED"
  | "PROCESSED"
  | "RETRY_SHIP"
  | "GETTING_TRACKING_NUMBER"
  | "CREATING_SHIPPING_DOC"
  | "DOWNLOADING_SHIPPING_DOC"
  | "SHIPPED"
  | "TO_CONFIRM_RECEIVE"
  | "IN_CANCEL"
  | "CANCELLED"
  | "TO_RETURN"
  | "COMPLETED";

export interface Order {
  id: string;
  ordersn: string;
  marketplace: "lazada" | "shopee" | "tokopedia";
  state: OrderState;
  // firebase reference field
  account: FirebaseFirestore.DocumentReference;
}
