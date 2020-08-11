import React from "react";
import description from "../../../algoProblemDescriptions/topological";
import AlgoHeader from "../../../components/AlgoHeader";
import { sleep } from "../../../services/utilities";
import TopoGraph from "./TopoGraph";

const numJobsLowerBound = 3;
const numJobsUpperBound = 9;

class Topo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedJobs: [],
      simulationIsRunning: false,
      simulationIsComplete: false,
      jobs: [],
      deps: [],
    };
    this._isMounted = true;
  }

  componentDidMount() {
    this.generateUnorderedJobList();
  }

  generateUnorderedJobList = () => {
    // const numJobs = Math.floor(
    //   Math.random() * (numJobsUpperBound - numJobsLowerBound) +
    //     numJobsLowerBound
    // );
    // const jobs = [];
    // const deps = [];
    // for (let i = 0; i < numJobs; i++) {
    //   jobs[i] = i + 1;
    //   deps.push(this.generateRandomDep(numJobs));
    // }

    // test case
    const jobs = [1, 2, 3, 4];
    const deps = [
      [1, 2],
      [1, 3],
      [3, 2],
      [4, 2],
      [4, 3],
    ];
    //expected output [1, 4, 3, 2] or [4, 1, 3, 2]

    this.setState({ jobs, deps });
  };

  generateRandomDep = (numJobs) => {
    const prereq = Math.floor(Math.random() * numJobs);
    const job = Math.floor(Math.random() * numJobs);
    return [prereq, job];
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  runSimulation = () => {
    this.setState({ simulationIsRunning: true });
  };

  handleSimulationCompletion = (orderedJobs) => {
    this.setState({
      simulationIsComplete: true,
      simulationIsRunning: false,
      orderedJobs,
    });
  };

  renderJobStringRow = (jobs, deps) => {
    const {
      orderedJobs,
      simulationIsComplete,
      simulationIsRunning,
    } = this.state;
    const depsStringArr = [];
    for (let [p, j] of deps) {
      depsStringArr.push(`[${p}, ${j}]`);
    }

    const depsString = `[ ${depsStringArr.join(", ")} ]`;

    return (
      <div className="jobRow">
        <div className="row d-flex justify-content-start align-items-center">
          <h6 className="no-wrap">Jobs: {`[${jobs.join(", ")}]`}</h6>
        </div>
        <div className="row d-flex justify-content-between align-items-center">
          <h6>Deps: {depsString}</h6>
          <h6 className="no-wrap">
            Ordered Jobs:{" "}
            {(simulationIsRunning || simulationIsComplete) &&
              `[${orderedJobs.join(", ")}]`}
          </h6>
        </div>
      </div>
    );
  };

  renderButtonRow = () => {
    const {
      simulationIsRunning,
      simulationIsComplete,
      orderedJobs,
    } = this.state;
    return (
      <div className="row d-flex justify-content-between">
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning}
            onClick={this.generateUnorderedJobList}
            className="btn btn-primary"
          >
            Randomize Job List
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
      </div>
    );
  };

  render() {
    const {
      jobs,
      deps,
      simulationIsRunning,
      simulationIsComplete,
    } = this.state;
    return (
      <>
        <AlgoHeader title="Topological Sort" description={description} />
        {this.renderButtonRow()}
        {jobs.length > 0 && this.renderJobStringRow(jobs, deps)}
        <div className="row grid">
          <div className="col">
            {(simulationIsRunning || simulationIsComplete) && (
              <TopoGraph
                onSimulationCompletion={this.handleSimulationCompletion}
                jobs={jobs}
                deps={deps}
                speed={this.props.speed * 10}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Topo;
