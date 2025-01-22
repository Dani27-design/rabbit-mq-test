import amqp from "amqplib";
import { config } from "../config";
import { OrderProcessorFactory } from "../factories/OrderProcessorFactory";
import { Order } from "../types";

class OrderConsumer {
  private channel: amqp.Channel | null = null;
  private marketplace: keyof typeof config.queues;

  constructor(marketplace: keyof typeof config.queues) {
    this.marketplace = marketplace;
  }

  async connect() {
    console.log(`Connecting to RabbitMQ for marketplace: ${this.marketplace}`);
    try {
      if (!config.amqpUrl) throw new Error("AMQP URL not provided");
  
      const connection = await amqp.connect(config.amqpUrl);
      this.channel = await connection.createChannel();
  
      const queue = config.queues[this.marketplace];
      const exchange = config.exchange;
  
      // Assert main exchange
      await this.channel.assertExchange(exchange, "direct", { durable: true });
  
      // Assert DLX exchange
      await this.channel.assertExchange(config.dlx.exchange, "direct", {
        durable: true,
      });
  
      // Assert DLX queue with specific routing key for each marketplace
      const dlxQueue = `dlx_queue_${this.marketplace}`; // Unique DLX queue for each marketplace
      await this.channel.assertQueue(dlxQueue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": exchange, // Set the main exchange as DLX
          "x-dead-letter-routing-key": this.marketplace, // Set the marketplace as routing key
          "x-message-ttl": 60000, // Message TTL in 60 seconds
        },
      });
  
      // Assert main queue
      await this.channel.assertQueue(queue, { durable: true });
  
      // Bind main queue to exchange
      await this.channel.bindQueue(queue, exchange, this.marketplace);
  
      // Bind DLX queue to DLX exchange
      await this.channel.bindQueue(
        dlxQueue,
        config.dlx.exchange,
        this.marketplace // Use the marketplace as routing key for DLX
      );
  
      this.channel.consume(queue, async (msg) => {
        if (!msg) return;
  
        const order: Order = JSON.parse(msg.content.toString());
        const processor = OrderProcessorFactory.createProcessor(this.marketplace);
  
        try {
          await processor.processOrder(order.state, order);
          this.channel?.ack(msg); // Successful message processing
        } catch (error) {
          console.error(`Error processing order ${order.ordersn}:`, error);
          this.channel?.reject(msg, true); // Message will be sent to DLX
        }
      });
  
      console.log(`Consumer for ${this.marketplace} is ready`);
    } catch (error) {
      console.error(
        `Error connecting to RabbitMQ for ${this.marketplace}:`,
        error
      );
      throw error;
    }
  }
  
}

export { OrderConsumer };
