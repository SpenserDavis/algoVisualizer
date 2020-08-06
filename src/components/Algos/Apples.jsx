import React from "react";
import description from "../../algoProblemDescriptions/apples";
import AlgoHeader from "../AlgoHeader";
import { sleep } from "../../services/utilities";

const colors = { 0: "white", 1: "green", 2: "purple" };

const gridHeight = 7;
const gridWidth = 15;
const emptyChance = 15;
const rottenChance = 15;

const initialStatePresets = {
  simulationIsRunning: false,
  simulationIsComplete: false,
  dayCounter: 0,
};

class Apples extends React.Component {
  state = {
    appleMatrix: [],
    ...initialStatePresets,
  };

  componentDidMount() {
    this.getRandomizedMatrix();
  }

  getRandomizedMatrix = () => {
    const appleMatrix = new Array(gridHeight).fill(0).map((_) => {
      const row = new Array(gridWidth).fill(0);
      for (let i = 0; i < gridWidth; i++) {
        let apple = 1;
        const randInt = Math.floor(Math.random() * 100);
        if (randInt < emptyChance) {
          apple = 0;
        } else if (randInt < emptyChance + rottenChance) {
          apple = 2;
        }

        row[i] = apple;
      }
      return row;
    });

    this.setState({
      appleMatrix,
      ...initialStatePresets,
    });
  };

  runSimulation = () => {
    const { appleMatrix } = this.state;
    this.setState({ simulationIsRunning: true }, async () => {
      let modifiableMatrix = new Array(appleMatrix.length)
        .fill(0)
        .map((_, i) => appleMatrix[i].slice());
      console.log("a");
      const dayCounter = await this.getNumDays(modifiableMatrix);
      this.setState({
        dayCounter,
        simulationIsRunning: false,
        simulationIsComplete: true,
      });
    });
  };

  getNumDays = async (matrix) => {
    let days = 0;
    console.log("b");
    const toTraverse = [[-1, -1]];
    let freshCount = [0];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] === 2) {
          toTraverse.unshift([i, j]);
        } else if (matrix[i][j] === 1) {
          freshCount[0]++;
        }
      }
    }

    if (!freshCount[0]) {
      return 0;
    }

    while (toTraverse.length) {
      const [x, y] = toTraverse.shift();
      if (x === -1) {
        if (toTraverse.length) {
          days++;
          this.setState({ dayCounter: days });
          toTraverse.push([-1, -1]);
        }
      } else {
        const infectedNeighbors = await this.infectNeighbors(
          x,
          y,
          matrix,
          freshCount
        );
        toTraverse.push(...infectedNeighbors);
      }
    }

    return freshCount[0] > 0 ? -1 : days;
  };

  infectNeighbors = async (x, y, matrix, freshCount) => {
    const infectedNeighbors = [];
    let infectionDidOccur = false;
    if (x > 0 && matrix[x - 1][y] === 1) {
      matrix[x - 1][y] = 2;
      freshCount[0]--;
      infectionDidOccur = true;
      infectedNeighbors.push([x - 1, y]);
    }
    if (x < matrix.length - 1 && matrix[x + 1][y] === 1) {
      matrix[x + 1][y] = 2;
      freshCount[0]--;
      infectionDidOccur = true;
      infectedNeighbors.push([x + 1, y]);
    }
    if (y > 0 && matrix[x][y - 1] === 1) {
      matrix[x][y - 1] = 2;
      freshCount[0]--;
      infectionDidOccur = true;
      infectedNeighbors.push([x, y - 1]);
    }
    if (y < matrix[0].length - 1 && matrix[x][y + 1] === 1) {
      matrix[x][y + 1] = 2;
      freshCount[0]--;
      infectionDidOccur = true;
      infectedNeighbors.push([x, y + 1]);
    }
    this.setState({ appleMatrix: matrix });
    if (infectionDidOccur) {
      await sleep(100);
    }
    return infectedNeighbors;
  };

  renderButtonRow = () => {
    const {
      simulationIsRunning,
      simulationIsComplete,
      dayCounter,
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
          <h6 className={simulationIsComplete ? "simCompleteBox" : ""}>
            Days: {(simulationIsRunning || simulationIsComplete) && dayCounter}
          </h6>
        </div>
        <div className="col"></div>
      </div>
    );
  };

  render() {
    const { appleMatrix } = this.state;
    return (
      <>
        <AlgoHeader title="Rotten Apples" description={description} />
        {this.renderButtonRow()}
        <div className="row grid">
          <div className="col">
            {appleMatrix.length &&
              appleMatrix.map((r, i) => (
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
  }
}

export default Apples;
