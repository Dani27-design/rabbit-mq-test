import cluster from "cluster";
import os from "os";
import { startWorker } from "./index"; // Import worker logic
import amqp from "amqplib"; // Import amqplib to interact with RabbitMQ
import { config } from "../config";

const MAX_QUEUE_LENGTH = 200; // Threshold to add workers
const MIN_QUEUE_LENGTH = 100; // Threshold to remove workers
const MAX_WORKERS = 10; // Maximum workers per marketplace
const MIN_WORKERS = 1; // Minimum workers per marketplace
const CHECK_INTERVAL = 1000 * 60 * 1; // Interval to check the queue length (ms)

export class WorkerManager {
  private marketplaces: string[];
  private diedWorkers: Map<number, string>; // Map to track dead workers
  private workerCount: Map<string, number>; // Map to track worker count per marketplace

  constructor(marketplaces: string[]) {
    this.marketplaces = marketplaces;
    this.diedWorkers = new Map();
    this.workerCount = new Map();
  }

  async start() {
    if (cluster.isPrimary) {
      console.log(`Primary process ${process.pid} is running`);

      // Fork initial workers for each marketplace
      this.marketplaces.forEach((marketplace) => {
        this.forkWorker(marketplace, "Initial worker");
      });

      // Listen for worker exits and refork if necessary
      cluster.on("exit", (worker, code, signal) => {
        const marketplace = this.diedWorkers.get(Number(worker.process.pid));
        console.log(
          `Worker ${worker.process.pid} died. Marketplace: ${marketplace}`
        );
        this.diedWorkers.delete(Number(worker.process.pid));

        // Restart the worker for the marketplace
        if (marketplace) {
          this.forkWorker(
            marketplace,
            `Replacing dead worker ${worker.process.pid}`
          );
        }
      });

      // Monitor worker failures
      cluster.on("message", (worker, message) => {
        if (message.status === "dead" && message.marketplace) {
          console.log(
            `Worker ${worker.process.pid} reported failure for marketplace: ${message.marketplace}`
          );
          this.diedWorkers.set(Number(worker.process.pid), message.marketplace);
        }
      });

      // Periodically check the queue length and adjust workers
      setInterval(() => {
        this.marketplaces.forEach((marketplace) => {
          this.checkQueueLengthAndAdjustWorkers(marketplace);
        });
      }, CHECK_INTERVAL);
    } else {
      // Start worker logic in child process
      process.on("message", (marketplace: string) => {
        startWorker(marketplace);
      });
    }
  }

  private forkWorker(marketplace: string, info: string) {
    const worker = cluster.fork();
    worker.send(marketplace);
    console.log(
      `Forked worker ${worker.process.pid} for ${marketplace}. Info: ${info}`
    );
    const count = this.workerCount.get(marketplace) || 0;
    this.workerCount.set(marketplace, count + 1);
  }

  private async checkQueueLengthAndAdjustWorkers(marketplace: string) {
    const queueLength = await this.getQueueLength(marketplace);
    const currentWorkerCount = this.workerCount.get(marketplace) || 0;

    console.log(`${marketplace} Queue Length : ${queueLength}`);

    if (queueLength > MAX_QUEUE_LENGTH && currentWorkerCount < MAX_WORKERS) {
      this.forkWorker(
        marketplace,
        `Adding worker for scaling up. Queue Length : ${queueLength}. Active Workers : ${currentWorkerCount}`
      );
    } else if (
      queueLength < MIN_QUEUE_LENGTH &&
      currentWorkerCount > MIN_WORKERS
    ) {
      this.removeWorker(marketplace, `Removing worker for scaling down. Queue Length : ${queueLength}. Active Workers : ${currentWorkerCount}`);
    }
  }

  private async getQueueLength(marketplace: string): Promise<number> {
    // Implement the logic to get the queue length from RabbitMQ
    // This is a placeholder implementation
    if (!config.amqpUrl) throw new Error("AMQP URL not provided");
    const connection = await amqp.connect(config.amqpUrl);
    const channel = await connection.createChannel();
    const queue = await channel.assertQueue(marketplace, { durable: true });
    const queueLength = queue.messageCount;
    await channel.close();
    await connection.close();
    return queueLength;
  }

  private removeWorker(marketplace: string, info?: string) {
    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if (worker) {
        worker.kill();
        console.log(
          `Killed worker ${worker.process.pid} for : ${marketplace}. Info: ${info}`
        );
        const count = this.workerCount.get(marketplace) || 0;
        this.workerCount.set(marketplace, count - 1);
        break;
      }
    }
  }
}
