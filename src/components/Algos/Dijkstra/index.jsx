import React from "react";
import description from "../../../algoProblemDescriptions/dijkstra";
import AlgoHeader from "../../../components/AlgoHeader";
import { sleep } from "../../../services/utilities";
import Buttons from "../../Buttons";

const colors = { 0: "white", 1: "blue" };

const gridHeight = 7;
const gridWidth = 15;

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

  getRandomizedGrid = () => {};

  runSimulation = () => {};

  renderGrid = (grid) => {};

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
