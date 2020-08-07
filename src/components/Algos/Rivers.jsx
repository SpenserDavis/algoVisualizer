import React from "react";
import description from "../../algoProblemDescriptions/rivers";
import AlgoHeader from "../../components/AlgoHeader";
import { sleep, shuffle } from "../../services/utilities";

const colors = { 0: "white", 1: "blue" };

const gridHeight = 7;
const gridWidth = 15;

const initialStatePresets = {
  simulationIsRunning: false,
  simulationIsComplete: false,
  riverSizes: [],
  visited: [],
  currNode: [-1, -1],
};

class Rivers extends React.Component {
  state = { riverMatrix: [], ...initialStatePresets };

  componentDidMount() {
    this.getRandomizedMatrix();
  }

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
    const riverChance = 0.01;
    const riverMatrix = new Array(gridHeight)
      .fill(0)
      .map((_) => new Array(gridWidth).fill(0));
    const visited = riverMatrix.slice().map((row) => row.map((_) => false));
    let currRiverIdx = 0;
    while (currRiverIdx < targetRiverSizes.length) {
      for (let i = 0; i < riverMatrix.length; i++) {
        for (let j = 0; j < gridWidth; j++) {
          const randInt = Math.random();

          if (
            randInt < riverChance &&
            !this.adjacentCellsContainRiver(i, j, riverMatrix)
          ) {
            const riverWasAdded = this.tryAddRiver(
              riverMatrix,
              i,
              j,
              currRiverIdx,
              targetRiverSizes
            );
            if (riverWasAdded && currRiverIdx === targetRiverSizes.length - 1) {
              this.setState({
                riverMatrix,
                ...initialStatePresets,
                visited,
              });
              return;
            } else if (riverWasAdded) {
              currRiverIdx++;
            }
          }
        }
      }
    }
  };

  tryAddRiver(matrix, i, j, idx, sizes) {
    // const mutateDirection = Math.random() < 0.2;

    matrix[i][j] = 1;
    sizes[idx]--;
    if (!sizes[idx]) {
      return true;
    }
    const neighbors = this.getUnoccupiedRandomAdjacent(matrix, i, j);

    if (!neighbors.length) {
      matrix[i][j] = 0;
      sizes[idx]++;
      return false;
    }

    for (let [x, y] of neighbors) {
      const riverWasAdded = this.tryAddRiver(matrix, x, y, idx, sizes);
      if (riverWasAdded) {
        return true;
      }
    }
    matrix[i][j] = 0;
    sizes[idx]++;
    return false;
  }

  getUnoccupiedRandomAdjacent = (matrix, i, j) => {
    const neighbors = [];
    if (
      i > 0 &&
      matrix[i - 1][j] === 0 &&
      !this.adjacentCellsContainRiver(i - 1, j, matrix, i, j)
    ) {
      neighbors.push([i - 1, j]);
    }
    if (
      i < matrix.length - 1 &&
      matrix[i + 1][j] === 0 &&
      !this.adjacentCellsContainRiver(i + 1, j, matrix, i, j)
    ) {
      neighbors.push([i + 1, j]);
    }
    if (
      j > 0 &&
      matrix[i][j - 1] === 0 &&
      !this.adjacentCellsContainRiver(i, j - 1, matrix, i, j)
    ) {
      neighbors.push([i, j - 1]);
    }
    if (
      j < matrix[0].length - 1 &&
      matrix[i][j + 1] === 0 &&
      !this.adjacentCellsContainRiver(i, j + 1, matrix, i, j)
    ) {
      neighbors.push([i, j + 1]);
    }

    return shuffle(neighbors);
  };

  adjacentCellsContainRiver = (i, j, matrix, prevX, prevY) => {
    if (i > 0 && matrix[i - 1][j] === 1 && prevX !== i - 1) {
      return true;
    }
    if (i < matrix.length - 1 && matrix[i + 1][j] === 1 && prevX !== i + 1) {
      return true;
    }
    if (j > 0 && matrix[i][j - 1] === 1 && prevY !== j - 1) {
      return true;
    }
    if (j < matrix[0].length - 1 && matrix[i][j + 1] === 1 && prevY !== j + 1) {
      return true;
    }

    return false;
  };

  getRiverSizes = async () => {
    this.setState({ simulationIsRunning: true });
    const riverSizes = [];
    const { riverMatrix, visited } = this.state;

    for (let i = 0; i < riverMatrix.length; i++) {
      for (let j = 0; j < riverMatrix[0].length; j++) {
        if (!visited[i][j]) {
          await this.exploreNode(i, j, riverMatrix, riverSizes, visited);
        }
      }
    }

    this.setState({
      visited,
      riverSizes,
      simulationIsRunning: false,
      simulationIsComplete: true,
      currNode: [-1, -1],
    });
  };

  exploreNode = async (i, j, matrix, riverSizes, visited) => {
    let currSize = 0;

    const nodesToExplore = [[i, j]];

    while (nodesToExplore.length) {
      const [x, y] = nodesToExplore.shift();
      this.setState({ currNode: [x, y] });
      await sleep(this.props.speed);
      if (visited[x][y]) {
        continue;
      }
      visited[x][y] = true;
      if (matrix[x][y] === 0) {
        continue;
      }
      currSize++;
      nodesToExplore.push(...this.getUnvisitedNeighbors(x, y, matrix, visited));
    }

    if (currSize) {
      riverSizes.push(currSize);
      this.setState({ riverSizes });
    }
  };

  getUnvisitedNeighbors = (i, j, matrix, visited) => {
    const neighbors = [];
    if (i > 0 && matrix[i - 1][j] && !visited[i - 1][j]) {
      neighbors.push([i - 1, j]);
    }

    if (j > 0 && matrix[i][j - 1] && !visited[i][j - 1]) {
      neighbors.push([i, j - 1]);
    }
    if (i < matrix.length - 1 && matrix[i + 1][j] && !visited[i + 1][j]) {
      neighbors.push([i + 1, j]);
    }
    if (j < matrix[0].length - 1 && matrix[i][j + 1] && !visited[i][j + 1]) {
      neighbors.push([i, j + 1]);
    }

    return neighbors;
  };

  getSquareStyles = (i, j, c) => {
    const { currNode, visited } = this.state;
    const [x, y] = currNode;
    const currNodeClass = i === x && j === y ? "currNode" : "";

    const visitedNodeClass = visited[i][j] ? "visitedNode" : "";
    const colorClass = colors[c];
    const riverNode = c === 1 ? "riverNode" : "";
    return `gridSquare ${colorClass} ${currNodeClass} ${visitedNodeClass} ${riverNode}`;
  };

  renderButtonRow = () => {
    const {
      simulationIsRunning,
      simulationIsComplete,
      riverSizes,
    } = this.state;
    return (
      <div className="row d-flex justify-content-between">
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
            onClick={this.getRiverSizes}
            className="btn btn-success"
          >
            Run Simulation
          </button>
        </div>
        <div className="col d-flex justify-content-center align-items-end">
          <h6
            className={`no-wrap ${
              simulationIsComplete ? "simCompleteBox" : ""
            }`}
          >
            Sizes:{" "}
            {(simulationIsRunning || simulationIsComplete) &&
              `[${riverSizes.toString()}]`}
          </h6>
        </div>
      </div>
    );
  };

  renderGrid = () => {
    const { riverMatrix } = this.state;
    return (
      <div className="row grid">
        <div className="col">
          {riverMatrix.length &&
            riverMatrix.map((r, i) => (
              <div
                className="row d-flex justify-content-center"
                key={`riverRow-${i}`}
              >
                {r.map((c, j) => (
                  <div key={`riverCol-${j}`}>
                    <div className={this.getSquareStyles(i, j, c)}> {c}</div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <>
          <AlgoHeader title="River Sizes" description={description} />
          {this.renderButtonRow()}
          {this.renderGrid()}
        </>
      </div>
    );
  }
}

export default Rivers;
