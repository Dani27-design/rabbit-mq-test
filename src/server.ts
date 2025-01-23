import express from "express";
import cluster from "cluster";
import { WorkerManager } from "./workers/workerManager";
import { config } from "./config";
import { OrderPublisher } from "./publishers/OrderPublisher";
import { startWorker } from "./workers/index"; // Import logic untuk worker processes
import { sendBatchOrdersShopee } from "./test/testShopeeOrder";
import { sendBatchAllOrders } from "./test/testAllOrder";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 9191;
const REQUESTS_PER_SECOND = 10;
const BATCH_INTERVAL = 1000; // 1 second in milliseconds

// Primary process: Start the server and manage workers
if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  // Start the server
  app.post("/webhook/:marketplace", async (req, res) => {
    const { marketplace } = req.params;
    const order = req.body;

    try {
      // Simpan data ke RabbitMQ
      const publisher = new OrderPublisher();
      await publisher.connect();
      await publisher.publish(order);
      res.status(200).send("Order received and processing started");
    } catch (error) {
      console.error("Error publishing order:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start publishing batch orders
    // Send 10 requests per second
    setInterval(() => {
      // 1 marketplace 1 queue
      sendBatchOrdersShopee(REQUESTS_PER_SECOND);
      // 3 marketplace 3 queue
      //   sendBatchAllOrders(REQUESTS_PER_SECOND);
    }, BATCH_INTERVAL);
  });

  // Start workers
  const workerManager = new WorkerManager(["shopee", "tokopedia", "lazada"]);
  workerManager.start();
} else {
  process.on("message", (marketplace: string) => {
    startWorker(marketplace); // Call function to start worker with marketplace parameter
  });
}
