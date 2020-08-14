import React from "react";
import description from "../../../algoProblemDescriptions/dijkstra";
import AlgoHeader from "../../../components/AlgoHeader";
import { sleep } from "../../../services/utilities";
import Buttons from "../../Buttons";
import { dijkstra, getNodesInShortestPathOrder } from "./algo";
import "./dijkstra.css";

const gridHeight = 10;
const gridWidth = 19;
const wallProbability = 0.4;

class Dijkstra extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      grid: [],
      startingNodeLocation: [-1, -1],
      destinationNodeLocation: [-1, -1],
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
    const elements = document.getElementsByClassName("gridSquare");
    for (let el of elements) {
      el.classList.remove("dnode-path", "dnode-visited");
    }
    console.log(elements);
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

    this._isMounted &&
      this.setState({
        grid,
        simulationIsComplete: false,
        startingNodeLocation,
        destinationNodeLocation,
      });
  };

  generateNewNode = (i, j, sLoc, dLoc) => {
    return {
      row: i,
      col: j,
      isStart: i === sLoc[0] && j === sLoc[1],
      isDestination: i === dLoc[0] && j === dLoc[1],
      visited: false,
      distance: Infinity,
      prev: null,
      isWall:
        j > gridWidth / 3 &&
        j < Math.floor((2 * gridWidth) / 3) &&
        Math.random() < wallProbability,
    };
  };

  runSimulation = async () => {
    this._isMounted && this.setState({ simulationIsRunning: true });
    const { grid, startingNodeLocation, destinationNodeLocation } = this.state;
    const [sx, sy] = startingNodeLocation;
    const [dx, dy] = destinationNodeLocation;
    const startingNode = grid[sx][sy];
    const destinationNode = grid[dx][dy];
    const visitedNodes = dijkstra(grid, startingNode, destinationNode);
    const pathNodes = getNodesInShortestPathOrder(destinationNode);
    await this.animateAlgo(visitedNodes, pathNodes);
    this._isMounted &&
      this.setState({ simulationIsRunning: false, simulationIsComplete: true });
  };

  animateAlgo = async (visitedNodes, pathNodes) => {
    const { speed } = this.props;
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        await sleep((speed / 50) * i);
        await this.animatePath(pathNodes);
        return;
      }

      await sleep((speed / 200) * i);
      const node = visitedNodes[i];
      let visitedClassName = "gridSquare dnode-visited";
      visitedClassName +=
        node.isStart || node.isDestination ? " dnode-green" : "";
      if (this._isMounted) {
        document.getElementById(
          `dnode-${node.row}-${node.col}`
        ).className = visitedClassName;
      }
    }
  };

  animatePath = async (pathNodes) => {
    const { speed } = this.props;
    for (let i = 0; i < pathNodes.length; i++) {
      await sleep(speed / 10);

      const node = pathNodes[i];
      let pathClassName = "gridSquare dnode-path";
      pathClassName += node.isStart || node.isDestination ? " dnode-green" : "";
      if (this._isMounted) {
        document.getElementById(
          `dnode-${node.row}-${node.col}`
        ).className = pathClassName;
      }
    }
  };

  getSquareStyles = (grid, i, j) => {
    const c = grid[i][j];
    let classNames = ["gridSquare"];

    if (c.isWall) {
      classNames.push("dnode-wall");
    }
    if (c.isStart || c.isDestination) {
      classNames.push("dnode-green");
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
                  <div
                    id={`dnode-${i}-${j}`}
                    className={this.getSquareStyles(grid, i, j)}
                  >
                    {c.isStart ? "s" : c.isDestination ? "d" : ""}
                  </div>
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
