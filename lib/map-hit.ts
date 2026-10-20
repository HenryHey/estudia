import type { MapPoint } from "@/content/comarques/ca";

/** Pixel size of public/maps/catalunya_blank.png. */
export const CATALUNYA_MAP_WIDTH = 2716;
export const CATALUNYA_MAP_HEIGHT = 2071;

/** Height / width of public/maps/catalunya_blank.png. */
const MAP_ASPECT = CATALUNYA_MAP_HEIGHT / CATALUNYA_MAP_WIDTH;

/** Space around the option box, as a fraction of the full map. */
const FRAME_PAD = 0.06;

/**
 * Click counts when it is near the right capital and closer to it than to any other.
 * Radius is a fraction of the map width (~20 km on this sheet).
 */
const HIT_RADIUS = 0.05;

export function mapPointDistance(a: MapPoint, b: MapPoint): number {
  const dx = a.x - b.x;
  const dy = (a.y - b.y) * MAP_ASPECT;
  return Math.hypot(dx, dy);
}

export type MapFrame = {
  scale: number;
  originX: number;
  originY: number;
};

/** Fixed crop that shows every option, centered, without leaving the map. */
export function mapOptionFrame(points: readonly MapPoint[]): MapFrame {
  if (points.length === 0) return { scale: 1, originX: 0, originY: 0 };

  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const span = Math.max(maxX - minX, maxY - minY);
  const view = Math.min(1, span + FRAME_PAD * 2);
  const scale = 1 / view;
  const originX = clamp((minX + maxX) / 2 - view / 2, 0, 1 - view);
  const originY = clamp((minY + maxY) / 2 - view / 2, 0, 1 - view);
  return { scale, originX, originY };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function nearestMapPoint(click: MapPoint, points: readonly MapPoint[]): MapPoint {
  return points.reduce((best, point) =>
    mapPointDistance(click, point) < mapPointDistance(click, best) ? point : best,
  );
}

/** A miss lands on the option circle when the click is near one; otherwise it stays on the click. */
export function mapMissPoint(click: MapPoint, options: readonly MapPoint[]): MapPoint {
  if (options.length === 0) return click;
  const nearest = nearestMapPoint(click, options);
  return mapPointDistance(click, nearest) <= HIT_RADIUS ? nearest : click;
}

export function isMapHit(
  click: MapPoint,
  targets: readonly MapPoint[],
  markers: readonly MapPoint[],
): boolean {
  if (targets.length === 0) return false;

  const bestTarget = Math.min(...targets.map((point) => mapPointDistance(click, point)));
  const others = markers.filter(
    (point) => !targets.some((target) => target.x === point.x && target.y === point.y),
  );
  const bestOther =
    others.length === 0
      ? Number.POSITIVE_INFINITY
      : Math.min(...others.map((point) => mapPointDistance(click, point)));

  return bestTarget <= HIT_RADIUS && bestTarget < bestOther;
}
