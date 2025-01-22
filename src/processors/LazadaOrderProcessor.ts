import { BaseOrderProcessor } from "./BaseOrderProcessor";
import { LazadaAPI } from "../services/LazadaAPI";
import { Order } from "../types";

export class LazadaOrderProcessor extends BaseOrderProcessor {
  private lazadaAPI: LazadaAPI;

  constructor() {
    super();
    this.lazadaAPI = new LazadaAPI();
  }

  async processOrder(currentState: string, order: Order): Promise<void> {
    try {
      const [orderDetail, orderItems] = await Promise.all([
        this.lazadaAPI.getOrderDetail(order.id),
        this.lazadaAPI.getOrderItems(order.id),
      ]);

      switch (currentState) {
        case "UNPAID":
          await this.handleUnpaidOrder(orderDetail, orderItems);
          break;
        case "PENDING":
          await this.handlePendingOrder(orderDetail, orderItems);
          await this.processOrder("PACK_IN_PROGRESS", order);
          break;
        case "PACK_IN_PROGRESS":
          await this.handlePackOrder(order);
          await this.processOrder("GET_SHIPPING_LABEL", order);
          break;
        case "GET_SHIPPING_LABEL":
          await this.handleGetShippingLabel(order);
          await this.processOrder("PACKED", order);
          break;
        case "PACKED":
          await this.handlePackedOrder(order);
          await this.processOrder("REQUEST_RTS", order);
          break;
        case "REQUEST_RTS":
          await this.handleRequestRTS(order);
          await this.processOrder("READY_TO_SHIP", order);
          break;
        case "READY_TO_SHIP":
        case "READY_TO_SHIP_PENDING":
          await this.handleReadyToShip(orderDetail, orderItems);
          break;
        case "SHIPPING":
          await this.handleShippingOrder(orderDetail, orderItems);
          break;
        case "COMPLETED":
          await this.handleCompletedOrder(orderDetail, orderItems);
          break;
        case "CANCELLED":
          await this.handleCancelledOrder(orderDetail, orderItems);
          break;
        case "RETURN":
          await this.handleReturnOrder(orderDetail, orderItems);
          break;
        default:
          throw new Error(`Unknown state: ${currentState}`);
      }
    } catch (error: any) {
      await this.handleError(order, currentState, error);
    }
  }

  private async handleUnpaidOrder(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handleUnpaidOrder Lazada for order",
      orderDetail?.orderId
    );
  }

  private async handlePendingOrder(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handlePendingOrder Lazada for order",
      orderDetail?.orderId
    );
  }

  private async handlePackOrder(order: Order): Promise<void> {
    console.log("Success handlePackOrder Lazada for order", order?.id);
  }

  private async handleGetShippingLabel(order: Order): Promise<void> {
    console.log("Success handleGetShippingLabel Lazada for order", order?.id);
  }

  private async handlePackedOrder(order: Order): Promise<void> {
    console.log("Success handlePackedOrder Lazada for order", order?.id);
  }

  private async handleRequestRTS(order: Order): Promise<void> {
    console.log("Success handleRequestRTS Lazada for order", order?.id);
  }

  private async handleReadyToShip(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handleReadyToShip Lazada for order",
      orderDetail?.orderId
    );
  }

  private async handleShippingOrder(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handleShippingOrder Lazada for order",
      orderDetail?.orderId
    );
  }

  private async handleCompletedOrder(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handleCompletedOrder Lazada for order",
      orderDetail?.orderId
    );
  }

  private async handleCancelledOrder(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handleCancelledOrder Lazada for order",
      orderDetail?.orderId
    );
  }

  private async handleReturnOrder(
    orderDetail: any,
    orderItems: any
  ): Promise<void> {
    console.log(
      "Success handleReturnOrder Lazada for order",
      orderDetail?.orderId
    );
  }
}
