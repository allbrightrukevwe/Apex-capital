export class SimplePriceFeed {
  private subscribers: Map<string, (price: number) => void> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private currentPrice: number = 2338;
  private asset: string = '';
  private isConnected: boolean = false;

  connect(asset: string): void {
    if (this.isConnected && this.asset === asset) return;
    if (this.intervalId) clearInterval(this.intervalId);
    this.asset = asset;
    this.isConnected = true;

    const assetKey = asset.toUpperCase();
    if (assetKey.includes('BTC')) this.currentPrice = 67500;
    else if (assetKey.includes('ETH')) this.currentPrice = 3400;
    else if (assetKey.includes('XAU') || assetKey.includes('GOLD')) this.currentPrice = 2338;
    else if (assetKey.includes('GBP')) this.currentPrice = 1.27;
    else if (assetKey.includes('SOL')) this.currentPrice = 175;
    else this.currentPrice = 2338;

    this.intervalId = setInterval(() => {
      if (!this.isConnected) return;
      let movePercent: number;
      
      // Small drift: ±0.08% per tick to simulate live price movement
      movePercent = (Math.random() - 0.48) * 0.0016;
      
      this.currentPrice = this.currentPrice * (1 + movePercent);

      if (this.currentPrice < 0.0001) this.currentPrice = 0.0001;
      
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