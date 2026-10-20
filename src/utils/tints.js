export const TINTS = ["#e4defd", "#d7f0e4", "#fde6c8", "#d6e8fb", "#fbd9e3"];

// A card's color: the one picked when it was created, else a stable fallback from its id.
export const getTint = (id) =>
  localStorage.getItem(`tint_${id}`) || TINTS[id % TINTS.length];

export const saveTint = (id, tint) => localStorage.setItem(`tint_${id}`, tint);
