import React from "react";
import "./merge.css";

const Arrow = ({ width, direction }) => {
  const computeSvgDims = () => {
    return { height: "50", width: `${width - 50}` };
  };

  const computeArrowDims = () => {
    return { x1: "0", y1: "25", x2: `${width - 66}`, y2: "25" };
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
