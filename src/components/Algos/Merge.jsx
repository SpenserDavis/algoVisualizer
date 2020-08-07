import React from "react";
import description from "../../algoProblemDescriptions/merge";
import AlgoHeader from "../AlgoHeader";

class LinkedList {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const listSize = 5;

class Merge extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = { listOne: {}, listTwo: {} };
  }

  componentDidMount() {
    this.initializeLists();
  }

  initializeLists = () => {
    const listOne = this.generateNewList();
    const listTwo = this.generateNewList();
    this.setState({ listOne, listTwo });
  };

  generateNewList = () => {
    const listHead = this.generateNewNode();
    let curr = listHead;
    let i = 0;
    while (i++ < listSize) {
      curr.next = this.generateNewNode();
      curr = curr.next;
    }
    return listHead;
  };

  generateNewNode = () => {
    const node = new LinkedList(Math.floor(Math.random() * 10));
    return node;
  };

  performMerge = (headOne, headTwo) => {
    let p1 = headOne;
    let p2 = headTwo;
    let p1Prev = null;

    while (p1 && p2) {
      if (p1.value < p2.value) {
        p1Prev = p1;
        p1 = p1.next;
      } else {
        if (p1Prev) {
          p1Prev.next = p2;
        }
        p1Prev = p2;
        p2 = p2.next;
        p1Prev.next = p1;
      }
    }

    if (!p1) {
      p1Prev.next = p2;
    }

    return headOne.value < headTwo.value ? headOne : headTwo;
  };

  renderButtonRow = () => {
    const { simulationIsRunning, simulationIsComplete } = this.state;
    return (
      <div className="row">
        <div className="col"></div>
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning}
            onClick={this.initializeLists}
            className="btn btn-primary"
          >
            Generate New Lists
          </button>
        </div>
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning || simulationIsComplete}
            onClick={this.performMerge}
            className="btn btn-success"
          >
            Merge Lists
          </button>
        </div>

        <div className="col"></div>
      </div>
    );
  };

  renderLists = (...lists) => {
    const html = [];
    for (let list of lists) {
      const row = [];
      let curr = list;
      while (curr) {
        row.push(<div className="gridSquare">{curr.value}</div>);
        curr = curr.next;
      }
      html.push(
        <div className="row d-flex justify-content-between listRow">{row}</div>
      );
    }

    return html;
  };

  render() {
    const { listOne, listTwo } = this.state;
    return (
      <>
        <AlgoHeader title="Merge Lists" description={description} />
        {this.renderButtonRow()}
        {this.renderLists(listOne, listTwo)}
      </>
    );
  }
}

export default Merge;
