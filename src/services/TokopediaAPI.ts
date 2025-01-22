import axios from 'axios';

export class TokopediaAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.TOKOPEDIA_API_URL || '';
    this.apiKey = process.env.TOKOPEDIA_API_KEY || '';
  }

  async getOrderDetail(fs_id: string, ordersn: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/orders/${fs_id}/${ordersn}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching Tokopedia order detail for ${ordersn}:`, error);
      throw error;
    }
  }

  // Tambahkan metode lain sesuai kebutuhan
}