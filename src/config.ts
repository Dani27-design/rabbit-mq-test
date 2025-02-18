import dotenv from "dotenv";
dotenv.config();

export const config = {
  amqpUrl: process.env.AMQP_URL,
  exchange: "orders.exchange",
  queues: {
    shopee: "orders.shopee",
    tokopedia: "orders.tokopedia",
    lazada: "orders.lazada",
  },
  dlx: {
    exchange: "dlx_exchange",
    queues: {
      shopee: "dlx_queue_shopee",
      tokopedia: "dlx_queue_tokopedia",
      lazada: "dlx_queue_lazada",
    },
    routingKeys: {
      shopee: "shopee",
      tokopedia: "tokopedia",
      lazada: "lazada",
    },
    messageTTL: 60000,
  },
  max_queue_length: 1000,
  min_queue_length: 100,
  max_workers: 1,
  min_workers: 1,
  check_interval: 1000 * 60 * 1,
};
