import React from "react";
import description from "../../../algoProblemDescriptions/topological";
import AlgoHeader from "../../../components/AlgoHeader";
import Buttons from "../../Buttons";
import AirportConnGraph from "./AirportConnGraph";
import { shuffle } from "../../../services/utilities";

const allAirports = [
  "BGI",
  "CDG",
  "DEL",
  "DOH",
  "DSM",
  "EWR",
  "EYW",
  "HND",
  "ICN",
  "JFK",
  "LGA",
  "LHR",
  "ORD",
  "SAN",
  "SFO",
  "SIN",
  "TLV",
  "BUD",
];

const numRoutesLowerBound = 3;
const numRoutesUpperBound = 10;

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

  generateAirportConnections = () => {
    const numAirports = Math.floor(
      Math.random() * (numRoutesUpperBound - numRoutesLowerBound) +
        numRoutesLowerBound
    );
    const numRoutes = Math.floor(
      Math.random() * (numAirports - numRoutesLowerBound) + numRoutesLowerBound
    );
    const randomAirports = shuffle(allAirports.slice());
    const airports = randomAirports.slice(0, numAirports);
    const startingAirport =
      airports[Math.floor(Math.random() * airports.length)];
    const connections = {};
    for (let i = 0; i < numRoutes; i++) {
      this.generateRandomConnection(airports, connections);
    }

    const routes = [];
    for (let start in connections) {
      for (let destination of connections[start])
        routes.push([start, destination]);
    }

    this._isMounted &&
      this.setState({
        airports,
        routes,
        startingAirport,
        simulationIsComplete: false,
        minConnections: 0,
      });
  };

  generateRandomConnection = (airports, connections) => {
    let start = airports[Math.floor(Math.random() * airports.length)];
    let destination = airports[Math.floor(Math.random() * airports.length)];

    while (
      start === destination ||
      (start in connections && connections[start].indexOf(destination) !== -1)
    ) {
      start = airports[Math.floor(Math.random() * airports.length)];
      destination = airports[Math.floor(Math.random() * airports.length)];
    }
    if (start in connections) {
      connections[start].push(destination);
    } else {
      connections[start] = [destination];
    }
  };

  runSimulation = () => {
    this._isMounted && this.setState({ simulationIsRunning: true });
  };

  handleSimulationCompletion = () => {
    this._isMounted &&
      this.setState({ simulationIsRunning: false, simulationIsComplete: true });
  };

  updateMinConnections = (minConnections) => {
    this._isMounted && this.setState({ minConnections });
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
        <div className="row d-flex justify-content-start align-items-center">
          <h6>Routes: {routesString}</h6>
        </div>
        <div className="row d-flex justify-content-start align-items-center">
          <h6 className="no-wrap">Starting Airport: {startingAirport}</h6>{" "}
        </div>
        <div className="row d-flex justify-content-end align-items-center">
          <h6
            className={`no-wrap ${
              simulationIsComplete ? "simCompleteBox" : ""
            }`}
          >
            Min Connections:{" "}
            {(simulationIsRunning || simulationIsComplete) && minConnections}
          </h6>
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

// test cases

// const airports = [
//   "BGI",
//   "CDG",
//   "DEL",
//   "DOH",
//   "DSM",
//   "EWR",
//   "EYW",
//   "HND",
//   "ICN",
//   "JFK",
//   "LGA",
//   "LHR",
//   "ORD",
//   "SAN",
//   "SFO",
//   "SIN",
//   "TLV",
//   "BUD"
// ],
// const routes = [
//   ["DSM", "ORD"],
//   ["ORD", "BGI"],
//   ["BGI", "LGA"],
//   ["SIN", "CDG"],
//   ["CDG", "SIN"],
//   ["CDG", "BUD"],
//   ["DEL", "DOH"],
//   ["DEL", "CDG"],
//   ["TLV", "DEL"],
//   ["EWR", "HND"],
//   ["HND", "ICN"],
//   ["HND", "JFK"],
//   ["ICN", "JFK"],
//   ["JFK", "LGA"],
//   ["EYW", "LHR"],
//   ["LHR", "SFO"],
//   ["SFO", "SAN"],
//   ["SFO", "DSM"],
//   ["SAN", "EYW"]
// ]
// const startingAirport = "LGA"

// const airports = ["JFK", "DEL", "ORD"];
// const routes = [
//   ["JFK", "DEL"],
//   ["DEL", "JFK"],
//   ["ORD", "DEL"],
// ];
// const startingAirport = "DEL";

// const airports = ["JFK", "DOH", "SAN", "BGI", "DSM"];
// const routes = [
//   ["DSM", "JFK"],
//   ["DSM", "SAN"],
//   ["BGI", "DOH"],
//   ["JFK", "SAN"],
// ];
// const startingAirport = "BGI";
