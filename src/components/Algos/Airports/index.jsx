import React from "react";
import description from "../../../algoProblemDescriptions/topological";
import AlgoHeader from "../../../components/AlgoHeader";
import Buttons from "../../Buttons";
import AirportConnGraph from "./AirportConnGraph";

class Airports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simulationIsRunning: false,
      simulationIsComplete: false,
      airports: [],
      routes: [],
      startingAirport: "",
      minConnections: 0,
    };
    this._isMounted = true;
  }

  componentDidMount() {
    this.generateAirportConnections();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  generateAirportConnections = () => {};

  runSimulation = () => {
    this._isMounted && this.setState({ simulationIsRunning: true });
  };

  renderAirportConnectionsRow = () => {
    const {
      airports,
      routes,
      startingAirport,
      simulationIsComplete,
      simulationIsRunning,
      minConnections,
    } = this.state;
    const routesStringArr = [];
    for (let [start, destination] of routes) {
      routesStringArr.push(`[${start}, ${destination}]`);
    }

    const routesString = `[ ${routesStringArr.join(", ")} ]`;

    return (
      <div className="widgetRow">
        <div className="row d-flex justify-content-start align-items-center">
          <h6 className="no-wrap">Airports: {`[${airports.join(", ")}]`}</h6>
        </div>
        <div className="row d-flex justify-content-between align-items-center">
          <h6>Routes: {routesString}</h6>
          <h6
            className={`no-wrap ${
              simulationIsComplete ? "simCompleteBox" : ""
            }`}
          >
            Min Connections:{" "}
            {(simulationIsRunning || simulationIsComplete) && minConnections}
          </h6>
        </div>
        <div className="row d-flex justify-content-start align-items-center">
          <h6 className="no-wrap">Starting Airport: {startingAirport}</h6>
        </div>
      </div>
    );
  };

  render() {
    const {
      airports,
      simulationIsComplete,
      simulationIsRunning,
      routes,
      startingAirport,
    } = this.state;
    return (
      <>
        <AlgoHeader title="Airport Connections" description={description} />
        <Buttons
          simulationIsRunning={simulationIsRunning}
          simulationIsComplete={simulationIsComplete}
          widget={"Airport Connections"}
          randomize={this.generateAirportConnections}
          runSimulation={this.runSimulation}
        />
        {airports.length > 0 && this.renderAirportConnectionsRow()}
        <div className="row grid">
          <div className="col">
            {(simulationIsRunning || simulationIsComplete) && (
              <AirportConnGraph
                onSimulationCompletion={this.handleSimulationCompletion}
                updateMinConnections={this.updateMinConnections}
                airports={airports}
                routes={routes}
                startingAirport={startingAirport}
                speed={this.props.speed * 10}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Airports;
