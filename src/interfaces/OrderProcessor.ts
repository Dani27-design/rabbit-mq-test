import { Order } from "../types";

export interface OrderProcessor {
  processOrder(currentState: string, order: Order): Promise<void>;
}
