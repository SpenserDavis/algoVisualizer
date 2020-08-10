import React from "react";
import "./merge.css";

const Arrow = ({ dims, direction }) => {
  const computeSvgDims = () => {
    return { height: `${dims}`, width: `${dims}` };
  };

  const computeArrowDims = () => {
    let x1, y1, x2, y2;
    switch (direction) {
      case "vertical-down":
        x1 = `${dims / 2}`;
        y1 = `5`;
        x2 = `${dims / 2}`;
        y2 = `${dims - 20}`;
        break;
      case "vertical-up":
        x1 = `${dims / 2}`;
        y1 = `${dims - 5}`;
        x2 = `${dims / 2}`;
        y2 = `20`;
        break;
      case "diagonal-up":
        x1 = "5";
        y1 = `${dims - 5}`;
        x2 = `${dims / 1.4}`;
        y2 = `20`;
        break;
      case "diagonal-down":
        x1 = "5";
        y1 = `5`;
        x2 = `${dims / 1.4}`;
        y2 = `${dims / 1.4}`;
        break;
      //horizontal
      default:
        x1 = "5";
        y1 = `${dims / 2}`;
        x2 = `${dims / 1.5}`;
        y2 = `${dims / 2}`;
        break;
    }

    return { x1, y1, x2, y2 };
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
      {/* <line
        x1={`${dims / 2}`}
        y1={`${dims - 5}`}
        x2={`${dims / 2}`}
        y2={`20`}
        className="arrow"
      /> */}
    </svg>
  );
};

export default Arrow;
