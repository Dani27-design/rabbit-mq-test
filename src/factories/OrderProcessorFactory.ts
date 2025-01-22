import { OrderProcessor } from '../interfaces/OrderProcessor';
import { ShopeeOrderProcessor } from '../processors/ShopeeOrderProcessor';
import { TokopediaOrderProcessor } from '../processors/TokopediaOrderProcessor';
import { LazadaOrderProcessor } from '../processors/LazadaOrderProcessor';

export class OrderProcessorFactory {
  static createProcessor(marketplace: string): OrderProcessor {
    switch (marketplace) {
      case 'shopee':
        return new ShopeeOrderProcessor();
      case 'tokopedia':
        return new TokopediaOrderProcessor();
      case 'lazada':
        return new LazadaOrderProcessor();
      default:
        throw new Error(`Unknown marketplace: ${marketplace}`);
    }
  }
}