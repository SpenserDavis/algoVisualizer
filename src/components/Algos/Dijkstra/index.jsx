import React from "react";
import description from "../../../algoProblemDescriptions/dijkstra";
import AlgoHeader from "../../../components/AlgoHeader";
import { sleep } from "../../../services/utilities";
import Buttons from "../../Buttons";
import { dijkstra, getNodesInShortestPathOrder } from "./algo";

const colors = {
  wall: "black",
  start: "green",
  destination: "green",
  visited: "blue",
};

const gridHeight = 10;
const gridWidth = 19;
const wallProbability = 0.5;

class Dijkstra extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      grid: [],
      simulationIsRunning: false,
      simulationIsComplete: false,
    };
  }

  componentDidMount() {
    this.getRandomizedGrid();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getRandomizedGrid = () => {
    const startingNodeLocation = [
      Math.floor(Math.random() * gridHeight),
      Math.floor((Math.random() * gridWidth) / 3),
    ];
    const destinationNodeLocation = [
      Math.floor(Math.random() * gridHeight),
      Math.floor(
        Math.random() * (gridWidth - (2 / 3) * gridWidth) + (2 / 3) * gridWidth
      ),
    ];

    const grid = [];

    for (let i = 0; i < gridHeight; i++) {
      const row = [];
      for (let j = 0; j < gridWidth; j++) {
        row.push(
          this.generateNewNode(
            i,
            j,
            startingNodeLocation,
            destinationNodeLocation
          )
        );
      }
      grid.push(row);
    }
    console.log(grid);
    this.setState({ grid });
  };

  generateNewNode = (i, j, sLoc, dLoc) => {
    return {
      i,
      j,
      isStart: i === sLoc[0] && j === sLoc[1],
      isDestination: i === dLoc[0] && j === dLoc[1],
      visited: false,
      distance: Infinity,
      prev: null,
      isWall:
        j > gridWidth / 3 &&
        j < Math.floor((2 * gridWidth) / 3) &&
        Math.random() > wallProbability,
    };
  };

  runSimulation = () => {};

  getSquareStyles = (grid, i, j) => {
    const c = grid[i][j];
    let classNames = ["gridSquare"];
    if (c.visited) {
      classNames.push(colors["visited"]);
    }
    if (c.isWall) {
      classNames.push(colors["wall"]);
    }
    if (c.isStart) {
      classNames.push(colors["start"]);
    }
    if (c.isDestination) {
      classNames.push(colors["destination"]);
    }

    return classNames.join(" ");
  };

  renderGrid = (grid) => {
    return (
      <div className="row grid">
        <div className="col">
          {grid.map((r, i) => (
            <div
              className="row d-flex justify-content-center"
              key={`gridRow-${i}`}
            >
              {r.map((c, j) => (
                <div key={`gridCol-${j}`}>
                  <div className={this.getSquareStyles(grid, i, j)}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { simulationIsComplete, simulationIsRunning, grid } = this.state;
    return (
      <>
        <AlgoHeader title="Shortest Path" description={description} />
        <Buttons
          randomize={this.getRandomizedGrid}
          runSimulation={this.runSimulation}
          widget={"Grid"}
          simulationIsRunning={simulationIsRunning}
          simulationIsComplete={simulationIsComplete}
        />
        {grid.length > 0 && this.renderGrid(grid)}
      </>
    );
  }
}

export default Dijkstra;
