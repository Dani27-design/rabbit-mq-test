import axios from "axios";

export class LazadaAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.LAZADA_API_URL || "";
    this.apiKey = process.env.LAZADA_API_KEY || "";
  }

  async getOrderDetail(orderId: string): Promise<any> {
    try {
      //   const response = await axios.get(`${this.apiUrl}/orders/${orderId}`, {
      //     headers: {
      //       'Authorization': `Bearer ${this.apiKey}`
      //     }
      //   });
      //   return response.data;
      console.log("Success fetching Lazada order detail for", orderId);
      return {
        orderId: orderId,
        ordersn: orderId,
        customerName: "Dani Lazada",
        customerPhone: "081234567890",
        customerEmail: "",
      };
    } catch (error) {
      console.error(
        `Error fetching Lazada order detail for ${orderId}:`,
        error
      );
      throw error;
    }
  }

  async getOrderItems(orderId: string): Promise<any> {
    try {
      //   const response = await axios.get(`${this.apiUrl}/orders/${orderId}/items`, {
      //     headers: {
      //       'Authorization': `Bearer ${this.apiKey}`
      //     }
      //   });
      //   return response.data;
      console.log("Success fetching Lazada order items for", orderId);
      return {
        orderId: orderId,
        items: [
          {
            sku: "SKU123",
            name: "Product 1",
            price: 100000,
            quantity: 1,
          },
          {
            sku: "SKU456",
            name: "Product 2",
            price: 200000,
            quantity: 2,
          },
        ],
      };
    } catch (error) {
      console.error(`Error fetching Lazada order items for ${orderId}:`, error);
      throw error;
    }
  }
}
