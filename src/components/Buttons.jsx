import React from "react";

const Buttons = ({
  simulationIsRunning,
  simulationIsComplete,
  widget,
  randomize,
  runSimulation,
}) => {
  const handleRandomizationRequest = () => {
    randomize();
  };

  const handleRunSimRequest = () => {
    setTimeout(
      () =>
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth",
        }),
      0.5
    );
    runSimulation();
  };

  return (
    <div className="row d-flex justify-content-between">
      <div className="col d-flex justify-content-center">
        <button
          disabled={simulationIsRunning}
          onClick={handleRandomizationRequest}
          className="btn btn-primary"
        >
          {`Randomize ${widget}`}
        </button>
      </div>
      <div className="col d-flex justify-content-center">
        <button
          disabled={simulationIsRunning || simulationIsComplete}
          onClick={handleRunSimRequest}
          className="btn btn-success"
        >
          Run Simulation
        </button>
      </div>
    </div>
  );
};

export default Buttons;
