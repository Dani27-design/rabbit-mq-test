import express from "express";
import { OrderPublisher } from "./publisher";
import { OrderConsumer } from "./consumers/OrderConsumer";
import { config } from "./config";
import cluster from "cluster";
import os from "os";
import { Order } from "./types";

const app = express();
app.use(express.json());

app.post("/webhook/:marketplace", async (req, res) => {
  const { marketplace } = req.params;
  const order: Order = req.body;

  try {
    const publisher = new OrderPublisher();
    await publisher.connect();
    await publisher.publish(order);
    res.status(200).send("Order received and processing started");
  } catch (error) {
    console.error("Error publishing order:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 9191;
let diedWorkers: any[] = [];

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  // Start the server on the primary process
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Marketplace list
  const marketplaces = ["shopee", "tokopedia", "lazada"];

  // Fork workers for each marketplace
  marketplaces.forEach((marketplace, index) => {
    const worker = cluster.fork(); // Fork worker
    worker.send(marketplace); // Send the marketplace info to the worker
  });

  cluster.on("message", (worker, message, handle) => {
    console.log(`Message from worker ${worker.process.pid}:`, message);
    // Listen for messages from workers about their death
    if (message.status === "dead") {
      // Add the dead worker to the diedWorkers array
      diedWorkers.push({
        pid: worker.process.pid,
        marketplace: message.marketplace,
      });
    }
  });

  // Monitor worker exit and re-fork for the dead worker
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Reforking...`);

    // If there are dead workers, fork a new one
    if (diedWorkers.length > 0) {
      setTimeout(() => {
        // Loop through dead workers and fork new workers for each marketplace
        diedWorkers.forEach((item, index) => {
          const newWorker = cluster.fork();
          newWorker.send(item.marketplace); // Send the marketplace to the new worker
          console.log(
            `New worker ${newWorker.process.pid} forked to replace dead worker ${item.pid}`
          );
          // Remove the dead worker from the list after forking
          diedWorkers.splice(index, 1);
        });
      }, 10000);
    }
  });
} else {
  // Worker listens to the marketplace message
  process.on("message", (marketplace: any) => {
    console.log(
      `Worker ${process.pid} listening for marketplace: ${marketplace}`
    );
    const consumer = new OrderConsumer(marketplace);
    consumer.connect().catch((error) => {
      console.error(
        `Worker ${process.pid} Error starting consumer for ${marketplace}:`,
        error
      );
      // Send message to parent process about worker failure
      if (process.send) {
        process.send({ status: "dead", marketplace: marketplace });
      }
      process.exit(1);
    });
  });

  // Log if worker process doesn't receive message (just in case)
  process.on("error", (err) => {
    console.error(`Worker ${process.pid} encountered error:`, err);
  });
}
