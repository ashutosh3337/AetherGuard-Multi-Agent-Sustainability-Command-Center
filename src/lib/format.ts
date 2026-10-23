import { Coins, Droplets, Leaf, Zap, type LucideIcon } from "lucide-react";
import type { ImpactKind, ResourceCategory, Severity } from "@/lib/types/domain";

export const IMPACT_META: Record<
  ImpactKind,
  { label: string; short: string; unit: string; prefix?: string; decimals: number; color: string; Icon: LucideIcon }
> = {
  co2: { label: "CO₂e avoided", short: "CO₂e", unit: "t", decimals: 1, color: "var(--emerald)", Icon: Leaf },
  water: { label: "Water saved", short: "Water", unit: "kL", decimals: 0, color: "var(--sky)", Icon: Droplets },
  cost: { label: "Cost reduced", short: "Cost", unit: "", prefix: "$", decimals: 0, color: "var(--teal)", Icon: Coins },
  energy: { label: "Energy optimized", short: "Energy", unit: "MWh", decimals: 1, color: "var(--amber)", Icon: Zap },
};

export const CATEGORY_META: Record<ResourceCategory, { label: string; color: string }> = {
  energy: { label: "Energy", color: "var(--amber)" },
  water: { label: "Water", color: "var(--sky)" },
  carbon: { label: "Carbon", color: "var(--emerald)" },
  waste: { label: "Waste", color: "var(--violet)" },
};

export const SEVERITY_META: Record<Severity, { label: string; color: string }> = {
  info: { label: "Info", color: "var(--text-3)" },
  low: { label: "Low", color: "var(--sky)" },
  medium: { label: "Medium", color: "var(--amber)" },
  high: { label: "High", color: "var(--coral)" },
  critical: { label: "Critical", color: "var(--coral)" },
};

const nfCache = new Map<number, Intl.NumberFormat>();
export function formatNumber(value: number, decimals = 0): string {
  let nf = nfCache.get(decimals);
  if (!nf) {
    nf = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    nfCache.set(decimals, nf);
  }
  return nf.format(value);
}

const compactNf = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const formatCompact = (v: number) => compactNf.format(v);

export function formatImpact(kind: ImpactKind, value: number, opts: { signed?: boolean } = {}): string {
  const m = IMPACT_META[kind];
  const sign = opts.signed && value > 0 ? "+" : "";
  const num = Math.abs(value) >= 10_000 ? formatCompact(value) : formatNumber(value, m.decimals);
  return `${sign}${m.prefix ?? ""}${num}${m.unit ? ` ${m.unit}` : ""}`;
}

export function formatRelative(at: number, now: number): string {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function initials(name: string | null | undefined, fallback = "AG"): string {
  if (!name) return fallback;
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || fallback;
}
