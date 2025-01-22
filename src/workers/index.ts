import cluster from "cluster";
import os from "os";
import { OrderConsumer } from "../consumers/OrderConsumer";

const marketplaces = ["shopee", "tokopedia", "lazada"];
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  marketplaces.forEach((marketplace:any) => {
    console.log(`Worker ${process.pid} listening for marketplace: ${marketplace}`);
    const consumer = new OrderConsumer(marketplace);
    consumer.connect().catch((error) => {
      console.error(`Error starting consumer for ${marketplace}:`, error);
      process.exit(1);
    });
  });
}
