import { BaseOrderProcessor } from './BaseOrderProcessor';
import { ShopeeAPI } from '../services/ShopeeAPI';
import { Order } from '../types';

export class ShopeeOrderProcessor extends BaseOrderProcessor {
  private shopeeAPI: ShopeeAPI;

  constructor() {
    super();
    this.shopeeAPI = new ShopeeAPI();
  }

  async processOrder(currentState: string, order: Order): Promise<void> {
    try {
      const orderDetail = await this.shopeeAPI.getOrderDetail(order.ordersn);

      switch (currentState) {
        case 'UNPAID':
        case 'PENDING':
          await this.handleUnpaidOrPendingOrder(orderDetail);
          break;
        case 'READY_TO_SHIP':
          await this.handleReadyToShipOrder(orderDetail);
          await this.processOrder('GETTING_SHIPPING_PARAMS', order);
          break;
        case 'GETTING_SHIPPING_PARAMS':
          await this.handleGetShippingParams(order);
          await this.processOrder('SHIP_ORDER_REQUESTED', order);
          break;
        case 'SHIP_ORDER_REQUESTED':
          await this.handleShipOrder(order);
          break;
        case 'PROCESSED':
        case 'RETRY_SHIP':
          await this.handleProcessedOrder(order);
          await this.processOrder('GETTING_TRACKING_NUMBER', order);
          break;
        case 'GETTING_TRACKING_NUMBER':
          await this.handleGetTrackingNumber(order);
          await this.processOrder('CREATING_SHIPPING_DOC', order);
          break;
        case 'CREATING_SHIPPING_DOC':
          await this.handleCreateShippingDoc(order);
          await this.processOrder('DOWNLOADING_SHIPPING_DOC', order);
          break;
        case 'DOWNLOADING_SHIPPING_DOC':
          await this.handleDownloadShippingDoc(order);
          break;
        case 'SHIPPED':
        case 'TO_CONFIRM_RECEIVE':
          await this.handleShippedOrder(orderDetail);
          break;
        case 'IN_CANCEL':
          await this.handleInCancelOrder(orderDetail);
          break;
        case 'CANCELLED':
          await this.handleCancelledOrder(orderDetail);
          break;
        case 'TO_RETURN':
          await this.handleReturnOrder(orderDetail);
          break;
        case 'COMPLETED':
          await this.handleCompletedOrder(orderDetail);
          break;
        default:
          throw new Error(`Unknown state: ${currentState}`);
      }
    } catch (error:any) {
      await this.handleError(order, currentState, error);
    }
  }

  private async handleUnpaidOrPendingOrder(orderDetail: any): Promise<void> {
    console.log('Success handling unpaid or pending order:', orderDetail.ordersn);
  }

  private async handleReadyToShipOrder(orderDetail: any): Promise<void> {
    console.log('Success handling ready to ship order:', orderDetail.ordersn);
  }

  private async handleGetShippingParams(order: Order): Promise<void> {
    console.log('Success getting shipping params for order:', order.ordersn);
  }

  private async handleShipOrder(order: Order): Promise<void> {
    console.log("Success handling ship order:", order.ordersn);
  }

  private async handleProcessedOrder(order: Order): Promise<void> {
    console.log("Success handling processed order:", order.ordersn);
  }

  private async handleGetTrackingNumber(order: Order): Promise<void> {
    console.log("Success getting tracking number for order:", order.ordersn);
  }

  private async handleCreateShippingDoc(order: Order): Promise<void> {
    console.log("Success creating shipping doc for order:", order.ordersn);
  }

  private async handleDownloadShippingDoc(order: Order): Promise<void> {
    console.log("Success downloading shipping doc for order:", order.ordersn);
  }

  private async handleShippedOrder(orderDetail: any): Promise<void> {
    console.log("Success handling shipped order:", orderDetail.ordersn);
  }

  private async handleInCancelOrder(orderDetail: any): Promise<void> {
    console.log("Success handling in cancel order:", orderDetail.ordersn);
  }

  private async handleCancelledOrder(orderDetail: any): Promise<void> {
    console.log("Success handling cancelled order:", orderDetail.ordersn);
  }

  private async handleReturnOrder(orderDetail: any): Promise<void> {
    console.log("Success handling return order:", orderDetail.ordersn);
  }

  private async handleCompletedOrder(orderDetail: any): Promise<void> {
    console.log("Success handling completed order:", orderDetail.ordersn);
  }
}