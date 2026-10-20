export const CARD_W = 320;
export const GAP = 20;
export const DEFAULT_H = 300;

const overlaps = (a, b) =>
  a.x < b.x + b.w + GAP &&
  a.x + a.w + GAP > b.x &&
  a.y < b.y + b.h + GAP &&
  a.y + a.h + GAP > b.y;

// First free spot reading left to right, top to bottom.
export const findFreeSpot = (rects, height, canvasW) => {
  const maxX = Math.max(0, canvasW - CARD_W);
  const cols = [];
  for (let x = 0; x <= maxX; x += CARD_W + GAP) cols.push(x);
  if (!cols.length) cols.push(0);

  for (let y = 0; y < 20000; y += 20) {
    for (const x of cols) {
      if (!rects.some((r) => overlaps({ x, y, w: CARD_W, h: height }, r))) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
};

// Cards that were moved keep their saved spot; the rest flow into the free space.
// bounds = how far left/right a card may sit (the window edges, not just the dashboard column)
export const computeLayout = (tasks, sizes, canvasW, bounds) => {
  const layout = {};
  const rects = [];
  const height = (t) => sizes[t.id] || DEFAULT_H;

  tasks.forEach((t) => {
    if (t.pos_x != null && t.pos_y != null) {
      layout[t.id] = {
        x: Math.min(Math.max(t.pos_x, bounds.minX), bounds.maxX),
        y: t.pos_y,
        pinned: true,
      };
      rects.push({ ...layout[t.id], w: CARD_W, h: height(t) });
    }
  });
  tasks.forEach((t) => {
    if (layout[t.id]) return;
    const spot = findFreeSpot(rects, height(t), canvasW);
    layout[t.id] = { ...spot, pinned: false };
    rects.push({ ...spot, w: CARD_W, h: height(t) });
  });
  return layout;
};
