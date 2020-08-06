import React from "react";
import description from "../../algoProblemDescriptions/apples";
import AlgoHeader from "../AlgoHeader";

const appleMatrix = new Array(7).fill(0).map((_) => new Array(7).fill(0));

const colors = { 0: "white", 1: "green", 2: "purple" };

const renderButtons = () => {
  return (
    <div className="row">
      <div className="col"></div>
      <div className="col d-flex justify-content-center">
        <button className="btn btn-primary">Randomize Grid</button>
      </div>
      <div className="col d-flex justify-content-center">
        <button className="btn btn-success">Run Simulation</button>
      </div>
      <div className="col"></div>
    </div>
  );
};

const Apples = () => {
  return (
    <>
      <AlgoHeader title="Rotten Apples" description={description} />
      {renderButtons()}
      <div className="row appleGrid">
        <div className="col">
          {appleMatrix.map((r, i) => (
            <div
              className="row d-flex justify-content-center"
              key={`appleRow-${i}`}
            >
              {r.map((c, j) => (
                <div key={`appleCol-${j}`}>
                  <div className={`gridSquare ${colors[c]}`}> {c}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Apples;
