import { OrderPublisher } from "../publishers/OrderPublisher";

type Order = {
  id: string;
  marketplace: "shopee" | "tokopedia" | "lazada";
  state:
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
  createdAt: Date;
  ordersn: string;
};

const statusFlow: Order["state"][] = [
  "UNPAID",
  "PENDING",
  "READY_TO_SHIP",
  "GETTING_SHIPPING_PARAMS",
  "SHIP_ORDER_REQUESTED",
  "PROCESSED",
  "RETRY_SHIP",
  "GETTING_TRACKING_NUMBER",
  "CREATING_SHIPPING_DOC",
  "DOWNLOADING_SHIPPING_DOC",
  "SHIPPED",
  "TO_CONFIRM_RECEIVE",
  "IN_CANCEL",
  "CANCELLED",
  "TO_RETURN",
  "COMPLETED",
];

const generateNewOrder = (): Order => {
  const marketplaceRandomize = ["shopee", "tokopedia", "lazada"][
    Math.floor(Math.random() * 3)
  ] as "shopee" | "tokopedia" | "lazada";
  const ordersnRandomize = Math.random().toString(36).substring(7);
  return {
    id: `${marketplaceRandomize}_${ordersnRandomize}`,
    marketplace: marketplaceRandomize,
    state: "UNPAID",
    createdAt: new Date(),
    ordersn: ordersnRandomize,
  };
};

const publisher = new OrderPublisher();

export const sendBatchAllOrders = async (batchSize: number) => {
  await publisher.connect();
  const orders = Array(batchSize)
    .fill(null)
    .map(() => {
      const order = generateNewOrder();
      const currentIndex = statusFlow.indexOf(order.state);
      const nextIndex = currentIndex + 1;

      if (Math.random() < 0.2) {
        order.state = "CANCELLED";
      } else if (nextIndex < statusFlow.length) {
        order.state = statusFlow[nextIndex];
      }
      return order;
    });

  await Promise.all(orders.map((order) => sendOrder(order)));
};

const sendOrder = async (order: Order) => {
  await publisher.publish(order);
};
