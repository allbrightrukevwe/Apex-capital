export class SimplePriceFeed {
  private subscribers: Map<string, (price: number) => void> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private currentPrice: number = 50000;
  private asset: string = 'BTC';
  private isConnected: boolean = false;
  private tradeCount: number = 0;

  connect(asset: string): void {
    if (this.isConnected) return;
    this.asset = asset;
    this.isConnected = true;

    switch(asset) {
      case 'BTC': this.currentPrice = 50000; break;
      case 'ETH': this.currentPrice = 3000; break;
      case 'SOL': this.currentPrice = 100; break;
      case 'XAU': this.currentPrice = 2331.45; break;
      default: this.currentPrice = 100;
    }

    this.intervalId = setInterval(() => {
      if (!this.isConnected) return;

      this.tradeCount++;
      
      let movePercent: number;
      
      // AFTER 7 TRADES - ALWAYS SMALL LOSSES
      if (this.tradeCount > 7) {
        // Small loss: -0.5% to -2%
        movePercent = -(0.005 + (Math.random() * 0.015));
      } 
      // FIRST 7 TRADES - BIG WINS
      else {
        // BIG PROFITS: +5% to +20% price increase
        movePercent = 0.05 + (Math.random() * 0.15);
      }
      
      this.currentPrice = this.currentPrice * (1 + movePercent);

      if (this.currentPrice < 100) this.currentPrice = 100;
      if (this.currentPrice > 500000) this.currentPrice = 500000;
      
      this.subscribers.forEach(cb => cb(this.currentPrice));
    }, 6000);
  }

  subscribe(asset: string, callback: (price: number) => void): () => void {
    if (!this.isConnected || this.asset !== asset) this.connect(asset);
    const id = Math.random().toString(36).substring(2, 9);
    this.subscribers.set(id, callback);
    callback(this.currentPrice);
    return () => this.subscribers.delete(id);
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.subscribers.clear();
  }
}

let priceFeedInstance: SimplePriceFeed | null = null;

export function getSimplePriceFeed(): SimplePriceFeed {
  if (!priceFeedInstance) priceFeedInstance = new SimplePriceFeed();
  return priceFeedInstance;
}