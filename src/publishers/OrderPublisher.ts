import amqp from "amqplib";
import { config } from "../config";
import { Order } from "../types";

class OrderPublisher {
  private channel: amqp.Channel | null = null;

  async connect() {
    console.log(
      `Connecting to AMQP as Publisher, url: ${config.amqpUrl}, exchange: ${config.exchange}`
    );
    try {
      if (!config.amqpUrl) throw new Error("AMQP URL not provided");
      const connection = await amqp.connect(config.amqpUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertExchange(config.exchange, "direct", {
        durable: true,
      });

      // Declare queues for each marketplace
      for (const queue of Object.values(config.queues)) {
        await this.channel.assertQueue(queue, { durable: true });
      }

      console.log("Publisher connected to RabbitMQ successfully");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  async publish(order: Order) {
    if (!this.channel) throw new Error("Channel not established");
    const queue = config.queues[order.marketplace];
    this.channel.publish(
      config.exchange,
      queue,
      Buffer.from(JSON.stringify(order)),
      { persistent: true }
    );
  }
}

export { OrderPublisher };
