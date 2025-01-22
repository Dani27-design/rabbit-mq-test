import { OrderProcessor } from '../interfaces/OrderProcessor';
import { FirestoreService } from '../services/FirestoreService';
import { Order } from '../types';

export abstract class BaseOrderProcessor implements OrderProcessor {
  protected firestoreService: FirestoreService;

  constructor() {
    this.firestoreService = new FirestoreService();
  }

  abstract processOrder(currentState: string, order: Order): Promise<void>;

  protected async handleError(order: Order, currentState: string, error: Error): Promise<void> {
    console.error(`Error processing order ${order.ordersn} in state ${currentState}:`, error);
    await this.firestoreService.saveOrderError(order.ordersn, currentState, error);
    throw error;
  }
}