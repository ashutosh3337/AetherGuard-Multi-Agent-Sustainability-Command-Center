/** Tiny, dependency-free SVG path helpers (no chart library on the client). */
export interface Point {
  x: number;
  y: number;
}

const r = (n: number) => Math.round(n * 100) / 100;

export function toPoints(
  values: number[],
  width: number,
  height: number,
  { pad = 0, min, max }: { pad?: number; min?: number; max?: number } = {},
): Point[] {
  if (values.length === 0) return [];
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = hi - lo || 1;
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  return values.map((v, i) => ({ x: r(i * step), y: r(pad + (1 - (v - lo) / span) * (height - pad * 2)) }));
}

/** Catmull-Rom → cubic Bézier. Symmetric, so reversing points traces the same curve. */
export function smoothPath(pts: Point[]): string {
  const first = pts[0];
  if (!first) return "";
  let d = `M${first.x},${first.y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1x = r(p1.x + (p2.x - p0.x) / 6);
    const c1y = r(p1.y + (p2.y - p0.y) / 6);
    const c2x = r(p2.x - (p3.x - p1.x) / 6);
    const c2y = r(p2.y - (p3.y - p1.y) / 6);
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function areaPath(pts: Point[], baselineY: number): string {
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (!first || !last) return "";
  return `${smoothPath(pts)} L${last.x},${baselineY} L${first.x},${baselineY} Z`;
}

/** Closed band between two series (e.g. savings gap between baseline and actual). */
export function bandPath(upper: Point[], lower: Point[]): string {
  if (!upper.length || !lower.length) return "";
  const back = smoothPath([...lower].reverse()).replace(/^M/, "L");
  return `${smoothPath(upper)} ${back} Z`;
}

export function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min || 1;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const err = (count * step) / span;
  const mult = err <= 0.15 ? 10 : err <= 0.35 ? 5 : err <= 0.75 ? 2 : 1;
  const s = step * mult;
  const start = Math.floor(min / s) * s;
  const ticks: number[] = [];
  for (let v = start; v <= max + s * 0.5; v += s) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}
