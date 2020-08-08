import React from "react";
import description from "../../../algoProblemDescriptions/merge";
import AlgoHeader from "../../AlgoHeader";
import Arrow from "./Arrow";
import { sleep } from "../../../services/utilities";

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
      p1Next: [-1, -1],
      p2: [-1, -1],
      p2Next: [-1, -1],
      p1Prev: [-1, -1],
      p1PrevNext: [-1, -1],
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

  performMerge = async () => {
    this.setState({
      simulationIsRunning: true,
      p1: [0, 2],
      p2: [4, 2],
      p1Prev: [0, 0],
      p1Next: [0, 4],
      p1PrevNext: [-1, -1],
      p2Next: [4, 4],
    });
    await sleep(this.props.speed + 1000);

    const {
      p1,
      p2,
      p1Prev,
      p1Next,
      p2Next,
      p1PrevNext,
      listOne,
      listTwo,
    } = this.state;

    let l1 = listOne;
    let l2 = listTwo;
    let l1Prev = null;
    let newP2;
    while (!this.areLastNullCells(p1[1]) && !this.areLastNullCells(p2[1])) {
      let currP1Row,
        currP1Col,
        currP2Row,
        currP2Col,
        currP1PrevRow,
        currP1PrevCol;

      const { p1PrevNext, p1Next, p2Next } = this.state;

      if (p1) {
        [currP1Row, currP1Col] = p1;
      }
      if (p2) {
        [currP2Row, currP2Col] = p2;
      }
      if (p1Prev) {
        [currP1PrevRow, currP1PrevCol] = p1Prev;
      }

      debugger;
      if (l1.value < l2.value) {
        l1Prev = l1;
        let newP1 = p1;
        this.setState({ p1Prev: newP1 });
        await sleep(this.props.speed + 1000);
        l1 = l1.next;

        this.setState({ p1: [currP1Row, currP1Col + 2] });
        await sleep(this.props.speed + 1000);
      } else {
        if (l1Prev) {
          l1Prev.next = l2;
          newP2 = p2;
          this.setState({ p1PrevNext: newP2 });
          await sleep(this.props.speed + 1000);
        }
        l1Prev = l2;
        this.setState({ p1Prev: newP2 });
        await sleep(this.props.speed + 1000);
        l2 = l2.next;
        let newP2Next = p2Next;
        this.setState({ p2: newP2Next });
        await sleep(this.props.speed + 1000);
        l1Prev.next = l1;
        let newP1 = p1;
        this.setState({ p1PrevNext: newP1 });
        await sleep(this.props.speed + 1000);
      }
    }

    if (!l1) {
      l1Prev.next = l2;
      this.setState({ p1PrevNext: newP2 });
      await sleep(this.props.speed + 1000);
    }
    this.setState({ simulationIsRunning: false, simulationIsComplete: true });
  };

  getSquareStyle = (i, j) => {
    let style = "gridSquare-node ";

    if (this.isNodeCell(i, j)) {
      style += "border-black";
    }
    return style;
  };

  isFirstNullCell = (i, j) => {
    return i === 1 && j === 0;
  };

  areLastNullCells = (j) => {
    return j === gridWidth - 1;
  };

  isArrowCell = (i, j) => {
    return i % 2 !== 0 && j % 2 !== 0 && j !== 1;
  };

  isNodeCell = (i, j) => {
    return (
      i % 2 !== 0 && j !== 0 && j !== 1 && j % 2 === 0 && j !== gridWidth - 1
    );
  };

  detectPointerCell = (i, j) => {
    const { p1, p2, p1Prev } = this.state;
    const [p1x, p1y] = p1;
    const [p2x, p2y] = p2;
    const [p1Px, p1Py] = p1Prev;

    if (i === p1x && j === p1y) {
      return "p1";
    } else if (i === p2x && j === p2y) {
      return "p2";
    } else if (i === p1Px && j === p1Py) {
      return "p1Prev";
    }
    return "";
  };

  getCellValue = (i, j, curr) => {
    if (this.isFirstNullCell(i, j)) {
      return "null";
    }

    if (i % 2 !== 0 && this.areLastNullCells(j)) {
      return "null";
    }

    const pointerCell = this.detectPointerCell(i, j);
    if (pointerCell) {
      return pointerCell;
    }

    if (this.isArrowCell(i, j)) {
      return <Arrow dims={nodeDims} direction="horizontal" />;
    }
    if (this.isNodeCell(i, j)) {
      return curr.value;
    }
  };

  addTriangle = (i, j) => {
    let direction = "";
    if (this.detectPointerCell(i, j)) {
      direction += i === 0 ? "down" : "up";
    }
    return direction ? (
      <div className={`triangle triangle-${direction}`}></div>
    ) : (
      ""
    );
  };

  renderLists = (listOne, listTwo) => {
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
                {this.addTriangle(i, j)}
              </div>
            );
          })}
        </div>
      );
    });
    return grid;
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
