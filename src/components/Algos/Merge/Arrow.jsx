import React from "react";
import "./merge.css";

const Arrow = ({ dims, direction }) => {
  const computeSvgDims = () => {
    return { height: "66", width: `${dims}` };
  };

  const computeArrowDims = () => {
    return {
      x1: "5",
      y1: `${dims / 2}`,
      x2: `${dims / 1.5}`,
      y2: `${dims / 2}`,
    };
    // return { x1: "0", y1: "50", x2: `${width - 50}`, y2: "110" };
  };

  return (
    <svg {...computeSvgDims()}>
      <defs>
        <marker
          id="markerArrow"
          markerWidth="13"
          markerHeight="13"
          refX="2"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#000000" }} />
        </marker>
      </defs>

      <line {...computeArrowDims()} className="arrow" />
    </svg>
  );
};

export default Arrow;
