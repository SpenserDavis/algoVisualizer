import React from "react";
import description from "../../../algoProblemDescriptions/merge";
import AlgoHeader from "../../AlgoHeader";
import Arrow from "./Arrow";

class LinkedList {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
const listSize = 5;
const gridWidth = listSize * 2 + 3;
const gridHeight = 5;
const nodeDims = 66;

class Merge extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      listOne: {},
      listTwo: {},
      p1: [-1, -1],
      p2: [-1, -1],
      p1Prev: [-1, -1],
      simulationIsRunning: false,
      simulationIsComplete: false,
    };
  }

  componentDidMount() {
    this.initializeLists();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initializeLists = () => {
    const listOne = this.generateNewList();
    const listTwo = this.generateNewList();
    this.setState({ listOne, listTwo });
  };

  generateNewList = () => {
    const arr = new Array(listSize);
    for (let i = 0; i < listSize; i++) {
      const randInt = Math.floor(Math.random() * 10);
      arr[i] = randInt;
    }
    arr.sort();
    let i = 0;
    const listHead = this.generateNewNode(arr[i++]);
    let curr = listHead;

    while (i < listSize) {
      curr.next = this.generateNewNode(arr[i++]);
      curr = curr.next;
    }
    return listHead;
  };

  generateNewNode = (v) => {
    const node = new LinkedList(v);
    return node;
  };

  performMerge = (headOne, headTwo) => {
    this.setState({ simulationIsRunning: true });
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
    this.setState({ simulationIsRunning: false, simulationIsComplete: true });
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

  getSquareStyle = (i, j) => {
    let style = "gridSquare-node ";

    //non-list rows
    if (i % 2 === 0) {
      return style;
    }
    //empty space in front of list
    if (j === 0 || j === 1 || j === gridWidth - 1) {
      return style;
    }
    //arrow squares
    if (j % 2 !== 0) {
      return style;
    }
    return (style += "border-black");
  };

  isFirstNullCell = (i, j) => {
    return i === 1 && j === 0;
  };

  areLastNullCells = (i, j) => {
    return i === 1 && j === gridWidth - 1;
  };

  isArrowCell = (i, j) => {
    return i % 2 !== 0 && j % 2 !== 0 && j !== 1;
  };

  isNodeCell = (i, j) => {
    return (
      i % 2 !== 0 && j !== 0 && j !== 1 && j % 2 === 0 && j !== gridWidth - 1
    );
  };

  getCellValue = (i, j, curr) => {
    if (this.isFirstNullCell(i, j)) {
      return "null";
    }

    if (this.areLastNullCells(i, j)) {
      return "null";
    }
    if (this.isArrowCell(i, j)) {
      return <Arrow dims={nodeDims} direction="horizontal" />;
    }
    if (this.isNodeCell(i, j)) {
      console.log("curr: ", curr);
      return curr.value;
    }
  };

  renderLists = (listOne, listTwo) => {
    console.log(listOne, listTwo);
    const grid = new Array(gridHeight).fill(0).map((row, i) => {
      let curr;
      if (i === 1) {
        curr = listOne;
      } else if (i === 3) {
        curr = listTwo;
      }

      return (
        <div
          key={`LL-row-${i}`}
          className={`row d-flex justify-content-center listRow`}
        >
          {new Array(gridWidth).fill(0).map((v, j) => {
            let prev = curr;
            if (this.isNodeCell(i, j)) {
              curr = curr.next;
            }
            return (
              <div
                key={`LLnode-${i}-${j}`}
                className={this.getSquareStyle(i, j)}
              >
                {this.getCellValue(i, j, prev)}
              </div>
            );
          })}
        </div>
      );
    });
    return grid;
  };

  render() {
    const { listOne, listTwo } = this.state;
    return (
      <>
        <AlgoHeader title="Merge Lists" description={description} />
        {this.renderButtonRow()}
        <div className="grid-container">
          {Object.keys(listOne).length > 0 &&
            this.renderLists(listOne, listTwo)}
        </div>
      </>
    );
  }
}

export default Merge;
