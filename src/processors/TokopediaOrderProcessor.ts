import { BaseOrderProcessor } from './BaseOrderProcessor';
import { TokopediaAPI } from '../services/TokopediaAPI';
import { Order } from '../types';

export class TokopediaOrderProcessor extends BaseOrderProcessor {
  private tokopediaAPI: TokopediaAPI;

  constructor() {
    super();
    this.tokopediaAPI = new TokopediaAPI();
  }

  async processOrder(currentState: string, order: Order): Promise<void> {
    try {
      const orderDetail = await this.tokopediaAPI.getOrderDetail(order?.account?.id ?? "", order.ordersn);

      switch (currentState) {
        case "UNPAID":
          await this.handleUnpaidOrder(orderDetail);
          break;
        case "WAITING_PAYMENT":
          await this.handleWaitingPaymentOrder(orderDetail);
          break;
        case "NEW_ORDER":
          await this.handleNewOrder(orderDetail);
          await this.processOrder("ACCEPT_IN_PROGRESS", order);
          break;
        case "ACCEPT_IN_PROGRESS":
          await this.handleAcceptOrder(order);
          await this.processOrder("GET_SHIPPING_LABEL", order);
          break;
        case "ACCEPTED":
          await this.handleAcceptedOrder(orderDetail);
          await this.processOrder("GET_SHIPPING_LABEL", order);
          break;
        case "GET_SHIPPING_LABEL":
          await this.handleGetShippingLabel(order);
          await this.processOrder("REQUEST_PICKUP", order);
          break;
        case "REQUEST_PICKUP":
          await this.handleRequestPickup(order);
          await this.processOrder("GET_SHIPPING_LABEL_URL", order);
          break;
        case "GET_SHIPPING_LABEL_URL":
          await this.handleGetShippingLabelUrl(order);
          await this.processOrder("READY_TO_SHIP", order);
          break;
        case "READY_TO_SHIP":
          await this.handleReadyToShip(orderDetail);
          break;
        case "SHIPPING":
          await this.handleShippingOrder(orderDetail);
          break;
        case "COMPLETED":
          await this.handleCompletedOrder(orderDetail);
          break;
        case "CANCELLED":
          await this.handleCancelledOrder(orderDetail);
          break;
        case "RETURN":
          await this.handleReturnOrder(orderDetail);
          break;
        default:
          throw new Error(`Unknown state: ${currentState}`);
      }
    } catch (error:any) {
      await this.handleError(order, currentState, error);
    }
  }

  // Implementasikan metode spesifik untuk Tokopedia
  private async handleUnpaidOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleWaitingPaymentOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleNewOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleAcceptOrder(order: Order): Promise<void> {
    // Implementasi logika
  }

  private async handleAcceptedOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleGetShippingLabel(order: Order): Promise<void> {
    // Implementasi logika
  }

  private async handleRequestPickup(order: Order): Promise<void> {
    // Implementasi logika
  }

  private async handleGetShippingLabelUrl(order: Order): Promise<void> {
    // Implementasi logika
  }

  private async handleReadyToShip(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleShippingOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleCompletedOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleCancelledOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }

  private async handleReturnOrder(orderDetail: any): Promise<void> {
    // Implementasi logika
  }
}