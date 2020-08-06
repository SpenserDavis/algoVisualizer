import React from "react";
import description from "../../algoProblemDescriptions/rivers";
import AlgoHeader from "../../components/AlgoHeader";

const colors = { 0: "white", 1: "blue" };

const gridHeight = 7;
const gridWidth = 15;

const initialStatePresets = {
  simulationIsRunning: false,
  simulationIsComplete: false,
  riverSizes: [],
};

class Rivers extends React.Component {
  state = { riverMatrix: [], ...initialStatePresets };

  getRandomizedRiverSizes = () => {
    let targetCumulativeSize = 21;
    let randomSizes = [];
    let currCumulativeSize = 0;
    while (currCumulativeSize < targetCumulativeSize) {
      let randInt = Math.ceil(Math.random() * 6);
      randomSizes.push(randInt);
      currCumulativeSize += randInt;
    }
    return randomSizes;
  };

  getRandomizedMatrix = () => {
    const targetRiverSizes = this.getRandomizedRiverSizes();
    const riverChance = 15;
    const riverMatrix = new Array(gridHeight).fill(0).map((_) => 0);

    while (targetRiverSizes.length) {
      let currRiverSize = targetRiverSizes.pop();
      for (let i = 0; i < riverMatrix.length; i++) {
        for (let j = 0; j < gridWidth; j++) {
          const randInt = Math.floor(Math.random() * 100);
          riverMatrix[i][j] = 0;
          if (
            randInt < riverChance &&
            !this.adjacentCellsContainRiver(i, j, riverMatrix)
          ) {
            riverMatrix[i][j] = 1;
          }
        }
      }
    }

    this.setState({
      riverMatrix,
      ...initialStatePresets,
    });
  };

  adjacentCellsContainRiver = (i, j, matrix) => {
    if (i > 0 && matrix[i - 1][j] === 1) {
      return true;
    }
    if (i < matrix.length - 1 && matrix[i + 1][j] === 1) {
      return true;
    }
    if (j > 0 && matrix[i][j - 1] === 1) {
      return true;
    }
    if (i < matrix[0].length - 1 && matrix[i][j + 1] === 1) {
      return true;
    }

    return false;
  };

  runSimulation = () => {};

  renderButtonRow = () => {
    const {
      simulationIsRunning,
      simulationIsComplete,
      riverSizes,
    } = this.state;
    return (
      <div className="row">
        <div className="col"></div>
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning}
            onClick={this.getRandomizedMatrix}
            className="btn btn-primary"
          >
            Randomize Grid
          </button>
        </div>
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning || simulationIsComplete}
            onClick={this.runSimulation}
            className="btn btn-success"
          >
            Run Simulation
          </button>
        </div>
        <div className="col d-flex justify-content-center align-items-end">
          <h6 className={simulationIsComplete && "simCompleteBox"}>
            Sizes: {(simulationIsRunning || simulationIsComplete) && riverSizes}
          </h6>
        </div>
        <div className="col"></div>
      </div>
    );
  };

  render() {
    const { riverMatrix } = this.state;
    return (
      <div>
        <>
          <AlgoHeader title="River Sizes" description={description} />
          {this.renderButtonRow()}
          <div className="row riverGrid">
            <div className="col">
              {riverMatrix.length &&
                riverMatrix.map((r, i) => (
                  <div
                    className="row d-flex justify-content-center"
                    key={`riverRow-${i}`}
                  >
                    {r.map((c, j) => (
                      <div key={`riverCol-${j}`}>
                        <div className={`gridSquare ${colors[c]}`}> {c}</div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </>
      </div>
    );
  }
}

export default Rivers;
