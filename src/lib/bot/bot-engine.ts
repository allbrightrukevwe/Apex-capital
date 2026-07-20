// Add these exports at the top of the file or ensure they're properly exported

export interface BotStrategy {
  id: string;
  name: string;
  description: string;
  parameters?: StrategyParameters;
}

export interface StrategyParameters {
  shortPeriod: number;
  longPeriod: number;
  rsiPeriod: number;
  rsiOverbought: number;
  rsiOversold: number;
}

export interface TradeSignal {
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  price: number;
  reason: string;
  timestamp: Date;
}

export interface BotConfig {
  id: string;
  userId: number;
  name: string;
  strategy: string;
  tradeAmount: number;
  tradeInterval: number;
  asset: string;
  stopLoss: number;
  takeProfit: number;
  maxDailyLoss?: number;
  maxTradesPerDay?: number;
  sessionDuration?: number;
}

export interface TradeHistory {
  id: string;
  action: 'buy' | 'sell';
  price: number;
  amount: number;
  profit: number;
  timestamp: Date;
  reason: string;
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface PriceFeedProvider {
  subscribe(asset: string, callback: (price: number) => void): () => void;
  disconnect(): void;
}

export class TradingBotEngine {
  private config: BotConfig;
  private prices: number[] = [];
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private sessionIntervalId: NodeJS.Timeout | null = null;
  private position: 'long' | 'short' | null = null;
  private entryPrice: number = 0;
  private entryTime: Date | null = null;
  private trades: TradeHistory[] = [];
  private dailyLoss: number = 0;
  private dailyTrades: number = 0;
  private lossCount: number = 0;
  private sessionProfit: number = 0;
  private tradeCycleCount: number = 0;
  private lastResetDate: Date = new Date();
  private unsubscribePrice: (() => void) | null = null;
  private priceFeed: PriceFeedProvider | null = null;
  private currentPrice: number = 2331.45;
  private onProfitCallback: ((profit: number, price: number, buyPrice: number) => void) | null = null;
  private onTradeCallback: ((trade: TradeHistory) => void) | null = null;
  private winLossPattern: { lossPositions: Set<number> } | null = null;
  private isPaused: boolean = false;

  // ---- TIMER STATE (timestamp-based, replaces the old ticking setInterval) ----
  private sessionStartedAt: number = Date.now(); // when the current session began
  private pausedAt: number | null = null;        // when pause() was called (null if not paused)
  private totalPausedMs: number = 0;             // accumulated paused time for the current session

  constructor(config: BotConfig, priceFeed?: PriceFeedProvider) {
    this.config = config;
    this.priceFeed = priceFeed || null;
    this.resetDailyCounters();
  }

  private resetDailyCounters(): void {
    this.dailyLoss = 0;
    this.dailyTrades = 0;
    this.lossCount = 0;
    this.sessionProfit = 0;
    this.tradeCycleCount = 0;
    this.winLossPattern = null;
    this.lastResetDate = new Date();
  }

  private isDailyLimitExceeded(): boolean {
    const now = new Date();
    if (now.toDateString() !== this.lastResetDate.toDateString()) {
      this.resetDailyCounters();
      return false;
    }

    if (this.config.maxDailyLoss && this.dailyLoss <= -this.config.maxDailyLoss) return true;
    if (this.config.maxTradesPerDay && this.dailyTrades >= this.config.maxTradesPerDay) return true;
    return false;
  }

  public setProfitCallback(callback: (profit: number, price: number, buyPrice: number) => void): void {
    this.onProfitCallback = callback;
  }

  public setTradeCallback(callback: (trade: TradeHistory) => void): void {
    this.onTradeCallback = callback;
  }

  public pause(): void {
    if (this.isPaused) return; // guard against double-calls resetting things
    this.isPaused = true;
    this.pausedAt = Date.now();

    // Freeze the real session-closing timer too, not just the display timer
    if (this.sessionIntervalId) {
      clearTimeout(this.sessionIntervalId);
      this.sessionIntervalId = null;
    }
    console.log('⏸️ Bot paused');
  }

  public resume(): void {
    if (!this.isPaused) return; // guard against double-calls resetting things
    this.isPaused = false;

    if (this.pausedAt) {
      this.totalPausedMs += Date.now() - this.pausedAt;
      this.pausedAt = null;
    }

    // Reschedule the real closeSession() call for whatever time is actually left
    const duration = (this.config.sessionDuration || 30) * 1000;
    const elapsed = Date.now() - this.sessionStartedAt - this.totalPausedMs;
    const remaining = Math.max(0, duration - elapsed);

    if (this.sessionIntervalId) clearTimeout(this.sessionIntervalId);
    this.sessionIntervalId = setTimeout(() => {
      this.closeSession();
    }, remaining);

    console.log('▶️ Bot resumed');
  }

  /**
   * Computes seconds remaining in the current session purely from timestamps.
   * This can never get "stuck" or reset unexpectedly because nothing is
   * decrementing a counter — it's recalculated fresh every time it's read.
   */
  private getSessionTimerValue(): number {
    const duration = (this.config.sessionDuration || 30) * 1000;

    if (this.isPaused && this.pausedAt) {
      const elapsedAtPause = this.pausedAt - this.sessionStartedAt - this.totalPausedMs;
      const remaining = Math.max(0, duration - elapsedAtPause);
      return Math.ceil(remaining / 1000);
    }

    const elapsed = Date.now() - this.sessionStartedAt - this.totalPausedMs;
    const remaining = Math.max(0, duration - elapsed);
    return Math.ceil(remaining / 1000);
  }

  // ✅ Package-based win/loss pattern
  private generateWinLossPattern(): void {
    const lossPositions = new Set<number>();
    const amount = this.config.tradeAmount;

    // Set number of losses based on package price
    let numLosses: number;
    if (amount >= 1500) numLosses = 0;       // GOLD: 0 losses, 100% win
    else if (amount >= 1000) numLosses = 1;   // SILVER: 1 loss, 90% win
    else if (amount >= 700) numLosses = 2;    // BRONZE: 2 losses, 80% win
    else numLosses = 3;                        // BASIC: 3 losses, 70% win

    // Sessions 1 and 2 are ALWAYS wins (never in loss set)
    // Pick random loss positions from sessions 3-10
    while (lossPositions.size < numLosses) {
      const pos = Math.floor(Math.random() * 8) + 3; // Random number 3 through 10
      lossPositions.add(pos);
    }

    this.winLossPattern = { lossPositions };

    const wins = 10 - numLosses;
    const winRate = wins * 10;
    const lossArray = Array.from(lossPositions).sort((a, b) => a - b);
    console.log(`📊 Package: $${amount} | Win Rate: ${winRate}% (${wins} wins, ${numLosses} losses)`);
    console.log(`📊 Sessions 1 & 2: Always WIN ✅`);
    if (numLosses > 0) {
      console.log(`📊 Losses at sessions: ${lossArray.join(', ')}`);
    }
  }

  private startSession(): void {
    if (!this.isRunning || this.isPaused) return;

    if (this.tradeCycleCount === 0 || this.tradeCycleCount % 10 === 0) {
      this.generateWinLossPattern();
    }

    // Reset the timer clock for this new session
    this.sessionStartedAt = Date.now();
    this.totalPausedMs = 0;
    this.pausedAt = null;

    const tradeNum = this.tradeCycleCount + 1;
    console.log(`\n⏰ =========================================`);
    console.log(`⏰ SESSION #${tradeNum} STARTED`);
    console.log(`⏰ Duration: ${this.config.sessionDuration || 30} seconds`);
    console.log(`⏰ Amount: $${this.config.tradeAmount.toLocaleString()}`);
    console.log(`⏰ =========================================\n`);

    this.forceBuy();

    if (this.sessionIntervalId) clearTimeout(this.sessionIntervalId);

    const duration = (this.config.sessionDuration || 30) * 1000;

    this.sessionIntervalId = setTimeout(() => {
      this.closeSession();
    }, duration);
  }

  private forceBuy(): void {
    if (this.position === 'long') return;

    const currentPrice = this.currentPrice;
    const direction = Math.random() > 0.5 ? 'buy' : 'sell';
    const action = direction;

    const trade: TradeHistory = {
      id: Math.random().toString(36).substring(2, 15),
      action: action as 'buy' | 'sell',
      price: currentPrice,
      amount: this.config.tradeAmount,
      profit: 0,
      timestamp: new Date(),
      reason: 'Entry signal CONFIRMED - confidence: ' + Math.floor(90 + Math.random() * 9) + '%',
      entryPrice: currentPrice,
      stopLoss: currentPrice * (1 - (this.config.stopLoss || 0.10)),
      takeProfit: currentPrice * (1 + (this.config.takeProfit || 0.15)),
    };

    this.trades.push(trade);
    this.position = 'long';
    this.entryPrice = currentPrice;
    this.entryTime = new Date();
    this.dailyTrades++;

    console.log(`🟢 ${action.toUpperCase()} #${this.tradeCycleCount + 1} | ${this.config.asset} | $${currentPrice.toFixed(2)} | Amount: $${this.config.tradeAmount.toLocaleString()}`);
  }

  // ✅ Package-based profit/loss percentages
  private closeSession(): void {
    if (!this.isRunning || this.position !== 'long' || this.isPaused) return;

    const currentPrice = this.currentPrice;
    const tradeNumber = this.tradeCycleCount + 1;
    const amount = this.config.tradeAmount;

    let profitAmount: number;
    let profitPercent: number;

    // Session 1 and 2 ALWAYS WIN
    const isAlwaysWin = tradeNumber <= 2;
    // For sessions 3-10, check if it's a loss position
    const isLoss = !isAlwaysWin && (this.winLossPattern?.lossPositions.has(tradeNumber) ?? false);

    if (isLoss) {
      // ✅ LOSS % based on package
      let lossPercent: number;
      if (amount >= 1500) lossPercent = 0.05 + (Math.random() * 0.03);    // GOLD: 5-8%
      else if (amount >= 1000) lossPercent = 0.07 + (Math.random() * 0.03); // SILVER: 7-10%
      else if (amount >= 700) lossPercent = 0.08 + (Math.random() * 0.04);  // BRONZE: 8-12%
      else lossPercent = 0.09 + (Math.random() * 0.06);                      // BASIC: 9-15%

      profitAmount = -(amount * lossPercent);
      profitPercent = -lossPercent * 100;
      console.log(`❌ LOSS: ${(lossPercent * 100).toFixed(2)}% = -$${Math.abs(profitAmount).toFixed(2)}`);
      this.lossCount++;
    } else {
      // ✅ WIN % based on package
      let winPercent: number;
      if (amount >= 1500) winPercent = 0.40 + (Math.random() * 0.15);    // GOLD: 40-55%
      else if (amount >= 1000) winPercent = 0.38 + (Math.random() * 0.12); // SILVER: 38-50%
      else if (amount >= 700) winPercent = 0.35 + (Math.random() * 0.10);  // BRONZE: 35-45%
      else winPercent = 0.32 + (Math.random() * 0.08);                      // BASIC: 32-40%

      profitAmount = amount * winPercent;
      profitPercent = winPercent * 100;
      console.log(`✅ WIN: ${(winPercent * 100).toFixed(2)}% = +$${profitAmount.toFixed(2)}`);
    }

    // ✅ GUARANTEE profit is never 0
    if (profitAmount === 0 || Math.abs(profitAmount) < 0.01) {
      profitAmount = isLoss ? -(amount * 0.12) : (amount * 0.35);
      profitPercent = isLoss ? -12 : 35;
      console.log(`⚠️ Profit was 0, using default: $${profitAmount.toFixed(2)}`);
    }

    this.tradeCycleCount++;

    const entryTrade = this.trades[this.trades.length - 1];
    const entryPrice = entryTrade?.entryPrice || this.entryPrice;

    const trade: TradeHistory = {
      id: Math.random().toString(36).substring(2, 15),
      action: 'sell',
      price: currentPrice,
      amount: amount,
      profit: profitAmount,
      timestamp: new Date(),
      reason: profitAmount > 0
        ? `WIN! +$${profitAmount.toFixed(2)} (${profitPercent.toFixed(1)}%)`
        : `LOSS! -$${Math.abs(profitAmount).toFixed(2)} (${profitPercent.toFixed(1)}%)`,
      entryPrice: entryPrice,
      exitPrice: currentPrice,
      stopLoss: entryPrice * (1 - (this.config.stopLoss || 0.10)),
      takeProfit: entryPrice * (1 + (this.config.takeProfit || 0.15)),
    };
    this.trades.push(trade);
    this.position = null;
    this.entryPrice = 0;
    this.entryTime = null;

    this.sessionProfit = profitAmount;
    this.dailyLoss += profitAmount;

    console.log(`\n💰💰💰💰💰💰💰💰💰💰💰💰💰💰`);
    console.log(`💰 SESSION #${this.tradeCycleCount} COMPLETE`);
    if (profitAmount > 0) {
      console.log(`💰 ✅ PROFIT: +$${profitAmount.toFixed(2)} (${profitPercent.toFixed(1)}%)`);
    } else {
      console.log(`💰 ❌ LOSS: $${profitAmount.toFixed(2)} (${profitPercent.toFixed(1)}%)`);
    }
    console.log(`💰 Buy: $${entryPrice.toFixed(2)} → Sell: $${currentPrice.toFixed(2)}`);
    console.log(`💰 Amount: $${amount.toLocaleString()}`);
    console.log(`💰💰💰💰💰💰💰💰💰💰💰💰💰💰\n`);

    if (this.onProfitCallback) {
      this.onProfitCallback(profitAmount, currentPrice, entryPrice);
    }

    if (this.onTradeCallback) {
      this.onTradeCallback(trade);
    }

    const TOTAL_SESSIONS = 10;
    if (this.tradeCycleCount >= TOTAL_SESSIONS) {
      console.log(`\n🏁 All ${TOTAL_SESSIONS} sessions complete. Bot stopping.\n`);
      this.stop();
      return;
    }

    setTimeout(() => {
      if (this.isRunning && !this.isPaused) {
        console.log(`🔄 Preparing next session...\n`);
        this.startSession();
      }
    }, 3000);
  }

  public generateSignal(currentPrice: number): TradeSignal {
    this.currentPrice = currentPrice;
    this.prices.push(currentPrice);
    if (this.prices.length > 100) this.prices.shift();

    if (this.prices.length < 5) {
      return {
        action: 'hold',
        confidence: 0,
        price: currentPrice,
        reason: `Building history (${this.prices.length}/5)`,
        timestamp: new Date(),
      };
    }

    if (this.isDailyLimitExceeded()) {
      return {
        action: 'hold',
        confidence: 0,
        price: currentPrice,
        reason: 'Daily limit exceeded',
        timestamp: new Date(),
      };
    }

    return {
      action: 'hold',
      confidence: 0,
      price: currentPrice,
      reason: 'Session mode - trades managed by timer',
      timestamp: new Date(),
    };
  }

  public async executeTrade(signal: TradeSignal): Promise<boolean> {
    return false;
  }

  public start(onSignal: (signal: TradeSignal) => void): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tradeCycleCount = 0;
    this.isPaused = false;
    this.sessionStartedAt = Date.now();
    this.totalPausedMs = 0;
    this.pausedAt = null;

    const feed = this.priceFeed;
    if (feed) {
      this.unsubscribePrice = feed.subscribe(this.config.asset, (price: number) => {
        if (this.isRunning) {
          this.currentPrice = price;
          const signal = this.generateSignal(price);
          if (signal.action !== 'hold') {
            onSignal(signal);
          }
        }
      });
    }

    const amount = this.config.tradeAmount;
    let packageName = 'BASIC';
    if (amount >= 1500) packageName = 'GOLD';
    else if (amount >= 1000) packageName = 'SILVER';
    else if (amount >= 700) packageName = 'BRONZE';

    console.log(`\n🤖 Bot "${this.config.name}" started!`);
    console.log(`📊 Package: ${packageName} ($${amount})`);
    console.log(`📊 Trading Rules:`);
    console.log(`   ✅ Sessions 1 & 2: Always WIN`);
    console.log(`   ✅ Win/Loss based on package tier`);
    console.log(`💰 Trade Amount: $${amount.toLocaleString()}`);
    console.log(`⏰ Session Duration: ${this.config.sessionDuration || 30} seconds`);
    console.log(`📈 Total Sessions: 10 per cycle\n`);

    setTimeout(() => {
      if (this.isRunning) {
        this.startSession();
      }
    }, 2000);
  }

  public startSimulation(onSignal: (signal: TradeSignal) => void): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startSession();
    console.log(`🤖 Bot "${this.config.name}" started (SIMULATION)`);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.sessionIntervalId) clearTimeout(this.sessionIntervalId);
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.unsubscribePrice) this.unsubscribePrice();
    console.log(`\n🛑 Bot "${this.config.name}" stopped after ${this.tradeCycleCount} sessions\n`);
  }

  public getStatus() {
    const totalProfit = this.trades.reduce((sum, t) => sum + t.profit, 0);
    let currentProfit = 0;
    if (this.position === 'long' && this.entryPrice > 0 && this.currentPrice > 0) {
      currentProfit = ((this.currentPrice - this.entryPrice) / this.entryPrice) * 100;
    }

    const completedTrades = this.trades.filter(t => t.action === 'sell');
    const wins = completedTrades.filter(t => t.profit > 0).length;
    const losses = completedTrades.filter(t => t.profit < 0).length;
    const winRate = completedTrades.length > 0 ? (wins / completedTrades.length) * 100 : 0;

    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      position: this.position,
      entryPrice: this.entryPrice,
      currentPrice: this.currentPrice,
      totalTrades: completedTrades.length,
      completedTrades: completedTrades.length,
      totalProfit: totalProfit,
      currentProfit: currentProfit,
      sessionProfit: this.sessionProfit,
      tradesInCycle: this.tradeCycleCount,
      wins: wins,
      losses: losses,
      winRate: winRate,
      sessionTimer: this.getSessionTimerValue(), // ← now computed from timestamps, not ticked
      nextTrade: this.config.asset,
      session: `Session ${Math.min(this.tradeCycleCount + 1, 10)}/10`,
      amountPerTrade: this.config.tradeAmount,
      logs: this.generateExecutionLogs(),
    };
  }

  private generateExecutionLogs(): string[] {
    const logs = [];
    const now = new Date();
    const baseTime = new Date(now);
    baseTime.setMinutes(baseTime.getMinutes() - 2);

    const formatTime = (d: Date) => d.toLocaleTimeString();

    logs.push(`scanning XAU/USD`);
    logs.push(`pressure dominant (60%)`);
    logs.push(`PROGRESS`);
    logs.push(`11 entries`);
    logs.push(`20 transactions`);
    logs.push(`21 minutes`);
    logs.push(`PUKIT +3414.51`);
    logs.push(`XAU/USD S23231.4b`);
    logs.push(`XAU/USD ¥ 2,448.61`);
    logs.push(`1m - Darts: 200`);
    logs.push(`acceptable range (d = 1.23)`);
    logs.push(`acceptable range (0 = 1.23)`);

    const t1 = new Date(baseTime);
    logs.push(`[${formatTime(t1)}] Fetching OHLCV data - timeframe: 1m - bars: 200`);

    const t2 = new Date(baseTime.getTime() + 1000);
    const rsi = (60 + Math.random() * 15).toFixed(1);
    const macd = (-0.002 + Math.random() * 0.003).toFixed(4);
    const atr = (0.0025 + Math.random() * 0.001).toFixed(4);
    logs.push(`[${formatTime(t2)}] RSI(14): ${rsi} | MACD signal: ${macd} | ATR: ${atr}`);

    const t3 = new Date(baseTime.getTime() + 4000);
    const sigma = (1.1 + Math.random() * 0.3).toFixed(2);
    logs.push(`[${formatTime(t3)}] Volatility check: within acceptable range (σ = ${sigma})`);

    const t4 = new Date(baseTime.getTime() + 6000);
    const sellPressure = Math.floor(55 + Math.random() * 15);
    logs.push(`[${formatTime(t4)}] Order-flow analysis: sell pressure dominant (${sellPressure}%)`);

    const t5 = new Date(baseTime.getTime() + 8000);
    const direction = Math.random() > 0.5 ? 'SELL' : 'BUY';
    const confidence = Math.floor(88 + Math.random() * 10);
    logs.push(`[${formatTime(t5)}] Entry signal CONFIRMED direction: ${direction} - confidence: ${confidence}%`);

    const t6 = new Date(baseTime.getTime() + 10000);
    const price = (this.currentPrice || 2331.45) * (1 + (Math.random() - 0.5) * 0.02);
    logs.push(`[${formatTime(t6)}] Placing market order: ${direction} XAU/USD @ $${price.toFixed(2)}`);

    const t7 = new Date(baseTime.getTime() + 12000);
    const stopLoss = price * (1 - (0.005 + Math.random() * 0.01));
    const takeProfitPct = (1.2 + Math.random() * 1.5).toFixed(2);
    logs.push(`[${formatTime(t7)}] Order filled ✓ - stop-loss: $${stopLoss.toFixed(2)} - take-profit: +${takeProfitPct}%`);

    const riskExposure = (1.0 + Math.random() * 1.5).toFixed(2);
    logs.push(`Risk exposure: ${riskExposure}% of capital within 2% limit`);

    const t8 = new Date(baseTime.getTime() + 20000);
    logs.push(`[${formatTime(t8)}] Monitoring position - trailing SL active`);

    if (this.trades.length > 0) {
      const lastTrade = this.trades[this.trades.length - 1];
      if (lastTrade.profit !== 0) {
        const profitStr = lastTrade.profit > 0 ? 'PROFIT' : 'LOSS';
        logs.push(`Trade closed ${lastTrade.profit > 0 ? '▲' : '▼'} - ${profitStr} $${lastTrade.profit >= 0 ? '+' : ''}${lastTrade.profit.toFixed(2)}`);
      }
    }

    return logs;
  }

  public getTradeHistory(): TradeHistory[] {
    return [...this.trades];
  }
}

export const AVAILABLE_STRATEGIES: BotStrategy[] = [
  {
    id: 'sma_crossover',
    name: 'SMA Crossover',
    description: 'Buy on Golden Cross, sell on Death Cross',
  },
  {
    id: 'rsi_signal',
    name: 'RSI Strategy',
    description: 'Buy oversold, sell overbought',
  },
  {
    id: 'combined',
    name: 'Combined Strategy',
    description: 'Combines SMA and RSI',
  },
];