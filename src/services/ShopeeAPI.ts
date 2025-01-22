import axios from "axios";

export class ShopeeAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.SHOPEE_API_URL || "";
    this.apiKey = process.env.SHOPEE_API_KEY || "";
  }

  async getOrderDetail(ordersn: string): Promise<any> {
    try {
      //   const response = await axios.get(`${this.apiUrl}/orders/${ordersn}`, {
      //     headers: {
      //       'Authorization': `Bearer ${this.apiKey}`
      //     }
      //   });
      //   return response.data;
      console.log("Success fetching Shopee order detail for", ordersn);
      return {
        ordersn: ordersn,
        customerName: "Dani Shopee",
        customerPhone: "081234567890",
        customerEmail: "",
      };
    } catch (error) {
      console.error(
        `Error fetching Shopee order detail for ${ordersn}:`,
        error
      );
      throw error;
    }
  }
}
