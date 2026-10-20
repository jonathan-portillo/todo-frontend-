import React, { useLayoutEffect, useRef, useState } from "react";

const MIN_COL = 304; // px, about 19rem
const GAP = 20; // px, matches the 1.25rem gap in the CSS

// Lays cards out in independent columns, so a card moves up when the one above it shrinks.
// Cards are dealt left to right, so a new card lands to the right of the last one.
const Masonry = ({ children }) => {
  const ref = useRef(null);
  const [cols, setCols] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      const width = ref.current.clientWidth;
      setCols(Math.max(1, Math.floor((width + GAP) / (MIN_COL + GAP))));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const columns = Array.from({ length: cols }, () => []);
  React.Children.toArray(children)
    .filter(Boolean)
    .forEach((child, i) => columns[i % cols].push(child));

  return (
    <div className="dash-masonry" ref={ref}>
      {columns.map((col, i) => (
        <div className="dash-col" key={i}>
          {col}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
