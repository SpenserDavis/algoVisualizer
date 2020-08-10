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
    const numJobs = Math.floor(
      Math.random() * (numJobsUpperBound - numJobsLowerBound) +
        numJobsLowerBound
    );
    const jobs = [];
    const deps = [];
    for (let i = 0; i < numJobs; i++) {
      jobs[i] = i + 1;
      deps.push(this.generateRandomDep(numJobs));
    }

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
    console.log(depsStringArr);
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
            onClick={this.topologicalSort}
            className="btn btn-success"
          >
            Run Simulation
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { jobs, deps } = this.state;
    return (
      <>
        <AlgoHeader title="Topological Sort" description={description} />
        {this.renderButtonRow()}
        {jobs.length > 0 && this.renderJobStringRow(jobs, deps)}
        <div className="row grid">
          <div className="col">
            <TopoGraph />
          </div>
        </div>
      </>
    );
  }
}

export default Topo;
