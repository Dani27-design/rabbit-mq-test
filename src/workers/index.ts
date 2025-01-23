import { OrderConsumer } from "../consumers/OrderConsumer";

export const startWorker = async (marketplace: any) => {
  console.log(`Worker ${process.pid} started for marketplace: ${marketplace}`);

  const consumer = new OrderConsumer(marketplace);
  try {
    await consumer.connect();
    console.log(
      `Worker ${process.pid} connected to RabbitMQ for marketplace: ${marketplace}`
    );
  } catch (error) {
    console.error(
      `Worker ${process.pid} failed for marketplace: ${marketplace}`,
      error
    );

    // Notify the parent process about the failure
    if (process.send) {
      process.send({ status: "dead", marketplace });
    }
    process.exit(1);
  }
};