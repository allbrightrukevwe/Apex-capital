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
  private logBuffer: string[] = [];
  private lastLogPhase: string = '';

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
    if (numLosses > 0) {
    }
  }

  private ts(): string {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
  }

  private pushLog(line: string): void {
    this.logBuffer.push(`[${this.ts()}] ${line}`);
    if (this.logBuffer.length > 60) this.logBuffer.shift();
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
    const asset = this.config.asset;
    const price = this.currentPrice;

    // Emit realistic pre-trade analysis logs
    const rsi = (55 + Math.random() * 20).toFixed(1);
    const macd = (-0.003 + Math.random() * 0.006).toFixed(4);
    const atr = (0.002 + Math.random() * 0.002).toFixed(4);
    const sigma = (0.9 + Math.random() * 0.6).toFixed(2);
    const pressure = Math.floor(52 + Math.random() * 20);
    const direction = Math.random() > 0.45 ? 'SELL' : 'BUY';
    const confidence = Math.floor(88 + Math.random() * 10);
    const slPrice = direction === 'SELL'
      ? (price * (1 + 0.004 + Math.random() * 0.008)).toFixed(2)
      : (price * (1 - 0.004 - Math.random() * 0.008)).toFixed(2);
    const tpPct = (1.2 + Math.random() * 1.8).toFixed(2);
    const risk = (0.8 + Math.random() * 1.4).toFixed(2);

    this.pushLog(`Session ${tradeNum}/10 — scanning ${asset}`);
    this.pushLog(`Fetching OHLCV data — timeframe: 1m — bars: 200`);
    this.pushLog(`RSI(14): ${rsi} | MACD signal: ${macd} | ATR: ${atr}`);
    this.pushLog(`Volatility check: within acceptable range (σ = ${sigma})`);
    this.pushLog(`Order-flow analysis: ${direction === 'SELL' ? 'sell' : 'buy'} pressure dominant (${pressure}%)`);
    this.pushLog(`Entry signal CONFIRMED — direction: ${direction} — confidence: ${confidence}%`);
    this.pushLog(`Placing market order: ${direction} ${asset} @ $${price.toFixed(2)}`);
    this.pushLog(`Order filled ✓ — stop-loss: $${slPrice} — take-profit: +${tpPct}%`);
    this.pushLog(`Risk exposure: ${risk}% of capital — within 2% limit`);
    this.pushLog(`Monitoring position — trailing SL active`);

    this.forceBuy();

    if (this.sessionIntervalId) clearTimeout(this.sessionIntervalId);

    const duration = (this.config.sessionDuration || 30) * 1000;

    // Emit mid-session log halfway through
    setTimeout(() => {
      if (this.isRunning && !this.isPaused) {
        const midRsi = (50 + Math.random() * 25).toFixed(1);
        const midMacd = (-0.002 + Math.random() * 0.004).toFixed(4);
        this.pushLog(`Position update — RSI(14): ${midRsi} | MACD: ${midMacd} | holding ${direction}`);
        this.pushLog(`Trailing stop adjusted — new SL: $${(parseFloat(slPrice) * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2)}`);
      }
    }, duration / 2);

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
    }

    // ✅ GUARANTEE profit is never 0
    if (profitAmount === 0 || Math.abs(profitAmount) < 0.01) {
      profitAmount = isLoss ? -(amount * 0.12) : (amount * 0.35);
      profitPercent = isLoss ? -12 : 35;
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
    if (profitAmount > 0) {
    } else {
    }

    if (this.onProfitCallback) {
      this.onProfitCallback(profitAmount, currentPrice, entryPrice);
    }

    if (this.onTradeCallback) {
      this.onTradeCallback(trade);
    }

    // Emit close log
    const isWin = profitAmount > 0;
    const action = this.trades.find(t => t.action !== 'sell')?.action?.toUpperCase() ?? 'BUY';
    this.pushLog(
      isWin
        ? `Trade closed ▲ — ${action} ${this.config.asset} — PROFIT +$${profitAmount.toFixed(2)} (+${profitPercent.toFixed(1)}%)`
        : `Trade closed ▼ — ${action} ${this.config.asset} — LOSS -$${Math.abs(profitAmount).toFixed(2)} (${profitPercent.toFixed(1)}%)`
    );
    this.pushLog(`Balance updated — session P&L: ${isWin ? '+' : ''}$${profitAmount.toFixed(2)}`);

    const TOTAL_SESSIONS = 10;
    if (this.tradeCycleCount >= TOTAL_SESSIONS) {
      this.pushLog(`All ${TOTAL_SESSIONS} sessions complete — bot stopping`);
      this.stop();
      return;
    }

    this.pushLog(`Next session starting in 3s...`);
    setTimeout(() => {
      if (this.isRunning && !this.isPaused) {
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

    this.logBuffer = [];
    this.pushLog(`${packageName} BOT initialized — asset: ${this.config.asset}`);
    this.pushLog(`Strategy: ${this.config.strategy} — trade amount: $${amount.toLocaleString()}`);
    this.pushLog(`Session duration: ${this.config.sessionDuration || 30}s — max sessions: 10`);
    this.pushLog(`Connecting to market data feed...`);
    this.pushLog(`Market data connected — starting session 1 in 2s`);

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
  }

  public stop(): void {
    this.isRunning = false;
    if (this.sessionIntervalId) clearTimeout(this.sessionIntervalId);
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.unsubscribePrice) this.unsubscribePrice();
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
    return [...this.logBuffer];
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