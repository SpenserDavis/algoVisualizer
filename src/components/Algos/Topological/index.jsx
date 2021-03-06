import React from "react";
import description from "../../../algoProblemDescriptions/topological";
import AlgoHeader from "../../../components/AlgoHeader";
import TopoGraph from "./TopoGraph";
import Buttons from "../../Buttons";

const numJobsLowerBound = 3;
const numJobsUpperBound = 8;

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

  componentWillUnmount() {
    this._isMounted = false;
  }

  generateUnorderedJobList = () => {
    const numJobs = Math.floor(
      Math.random() * (numJobsUpperBound - numJobsLowerBound) +
        numJobsLowerBound
    );
    const jobs = [];
    const depList = {};
    for (let i = 0; i < numJobs; i++) {
      jobs[i] = i + 1;
      this.generateRandomDep(numJobs, depList);
    }
    const deps = [];

    for (let job in depList) {
      for (let prereq of depList[job]) deps.push([prereq, parseInt(job)]);
    }
    console.log(deps);
    this.setState({ jobs, deps, simulationIsComplete: false });
  };

  generateRandomDep = (numJobs, depList) => {
    let prereq = Math.ceil(Math.random() * numJobs);
    let job = Math.ceil(Math.random() * numJobs);
    while (
      prereq === job ||
      (job in depList && depList[job].indexOf(prereq) !== -1)
    ) {
      prereq = Math.ceil(Math.random() * numJobs);
      job = Math.ceil(Math.random() * numJobs);
    }
    if (job in depList) {
      depList[job].push(prereq);
    } else {
      depList[job] = [prereq];
    }
  };

  runSimulation = () => {
    this._isMounted && this.setState({ simulationIsRunning: true });
  };

  handleSimulationCompletion = (orderedJobs) => {
    this._isMounted &&
      this.setState({
        simulationIsComplete: true,
        simulationIsRunning: false,
        orderedJobs,
      });
  };

  updateOrderedJobs = (orderedJobs) => {
    this._isMounted && this.setState({ orderedJobs });
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
      <>
        <div className="jobRow row d-flex justify-content-start align-items-center">
          <div className="col">
            <h6>Jobs: {`[${jobs.join(", ")}]`}</h6>

            <h6>Deps: {depsString}</h6>
          </div>
        </div>

        <div className="ioRow row d-flex justify-content-center align-items-center">
          <h6 className={simulationIsComplete ? "simCompleteBox" : ""}>
            Ordered Jobs:{" "}
            {(simulationIsRunning || simulationIsComplete) &&
            orderedJobs.length > 0
              ? `[${orderedJobs.join(", ")}]`
              : "[ ]"}
          </h6>
        </div>
      </>
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
        <Buttons
          randomize={this.generateUnorderedJobList}
          runSimulation={this.runSimulation}
          widget={"Job List"}
          simulationIsRunning={simulationIsRunning}
          simulationIsComplete={simulationIsComplete}
        />
        {jobs.length > 0 && this.renderJobStringRow(jobs, deps)}
        <div className="row grid">
          <div className="col">
            {(simulationIsRunning || simulationIsComplete) && (
              <TopoGraph
                onSimulationCompletion={this.handleSimulationCompletion}
                updateOrderedJobs={this.updateOrderedJobs}
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

// test cases

// const jobs = [1, 2, 3, 4];
// const deps = [
//   [1, 2],
//   [1, 3],
//   [3, 2],
//   [4, 2],
//   [4, 3],
// ];
// expected output [1, 4, 3, 2] or [4, 1, 3, 2]

// const jobs = [1, 2, 3, 4, 5, 6, 7, 8];
// const deps = [
//   [1, 2],
//   [1, 3],
//   [1, 4],
//   [1, 5],
//   [1, 6],
//   [1, 7],
//   [2, 8],
//   [3, 8],
//   [4, 8],
//   [5, 8],
//   [6, 8],
//   [7, 8],
// ];
// expected output [1, 2, 3, 4, 5, 6, 7, 8]
