export type IntelligenceWing = "crypto" | "infra" | "autonomy";

export type WingTickerConfig = {
  wing: IntelligenceWing;
  symbol: string;
  label: string;
  basePrice: number;
  step: number;
};

const WING_CONFIG: Record<IntelligenceWing, WingTickerConfig> = {
  crypto: {
    wing: "crypto",
    symbol: "BTC/USD",
    label: "Crypto Intelligence",
    basePrice: 62450,
    step: 95,
  },
  infra: {
    wing: "infra",
    symbol: "NVDA",
    label: "AI Infrastructure",
    basePrice: 895.4,
    step: 1.85,
  },
  autonomy: {
    wing: "autonomy",
    symbol: "TSLA",
    label: "Autonomous Systems",
    basePrice: 182.5,
    step: 0.65,
  },
};

export function getWingForSlot(slot: number): WingTickerConfig {
  if (slot < 10) {
    return WING_CONFIG.crypto;
  }

  if (slot < 20) {
    return WING_CONFIG.infra;
  }

  return WING_CONFIG.autonomy;
}

export function initialTickerPrice(slot: number, config: WingTickerConfig): number {
  return config.basePrice + slot * config.step * 0.17;
}

export function formatTickerPrice(symbol: string, value: number): string {
  if (symbol.startsWith("BTC") || value >= 1000) {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  return `$${value.toFixed(2)}`;
}

export function formatTickerChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}
