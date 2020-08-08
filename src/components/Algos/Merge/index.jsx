import React from "react";
import description from "../../../algoProblemDescriptions/merge";
import AlgoHeader from "../../AlgoHeader";
import Arrow from "./Arrow";
import { sleep } from "../../../services/utilities";

class LinkedList {
  constructor(value, list) {
    this.value = value;
    this.next = null;
    this.list = list;
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
      arrows: [],
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
    const listOne = this.generateNewList(1);
    const listTwo = this.generateNewList(2);

    const arrows = new Array(gridHeight).fill(0);

    for (let i = 0; i < arrows.length; i++) {
      const row = [];
      for (let j = 0; j < gridWidth; j++) {
        if (this.isInitialArrowCell(i, j)) {
          row.push("horizontal");
        } else {
          row.push("");
        }
      }
      arrows[i] = row;
    }

    this.setState({ listOne, listTwo, arrows });
  };

  generateNewList = (listNum) => {
    const arr = new Array(listSize);
    for (let i = 0; i < listSize; i++) {
      const randInt = Math.floor(Math.random() * 10);
      arr[i] = randInt;
    }
    arr.sort();
    let i = 0;
    const listHead = new LinkedList(arr[i++], listNum);
    let curr = listHead;

    while (i < listSize) {
      curr.next = new LinkedList(arr[i++], listNum);
      curr = curr.next;
    }
    return listHead;
  };

  copyList = (list, listNum) => {
    let newHead = new LinkedList(0, listNum);
    let curr = newHead;
    while (list) {
      curr.next = new LinkedList(list.value, listNum);
      list = list.next;
      curr = curr.next;
    }

    return newHead.next;
  };

  performMerge = async () => {
    this.setState({
      simulationIsRunning: true,
      p1: [0, 2],
      p2: [4, 2],
      p1Prev: [0, 0],
    });
    await sleep(this.props.speed + 1000);

    const { p1, p2, p1Prev, listOne, listTwo } = this.state;

    let l1 = this.copyList(listOne, 1);
    let l2 = this.copyList(listTwo, 2);

    let l1Prev = null;

    const arrows = this.state.arrows.slice();
    let [currP1Row, currP1Col] = p1;

    let [currP2Row, currP2Col] = p2;

    let [currP1PrevRow, currP1PrevCol] = p1Prev;
    let direction;
    while (!this.areLastNullCells(p1[1]) && !this.areLastNullCells(p2[1])) {
      debugger;
      if (l1.value < l2.value) {
        l1Prev = l1;

        this.setState({ p1Prev: p1 });
        currP1PrevCol = currP1Col;
        currP1PrevRow = currP1Row;
        await sleep(this.props.speed + 1000);
        l1 = l1.next;

        this.setState({ p1: [0, currP1Col + 2] });
        currP1Col += 2;
        await sleep(this.props.speed + 1000);
      } else {
        if (l1Prev) {
          l1Prev.next = l2;
          if (currP1PrevRow === currP2Row) {
            direction = "horizontal";
          } else {
            if (currP1PrevCol === currP2Col) {
              direction = "vertical-down";
            } else {
              direction = "diagonal-down";
            }
          }
          if (direction !== "horizontal") {
            arrows[currP1PrevRow === 0 ? 1 : 3][currP1PrevCol + 1] = "";
            arrows[2][currP1PrevCol + 1] = direction;
          }
          this.setState({ arrows });
          await sleep(this.props.speed + 1000);
        }
        l1Prev = l2;
        this.setState({ p1Prev: p2 });
        currP1PrevCol = currP2Col;
        currP1PrevRow = currP2Row;
        await sleep(this.props.speed + 1000);
        l2 = l2.next;

        this.setState({ p2: [4, currP2Col + 2] });
        currP2Col += 2;
        await sleep(this.props.speed + 1000);
        l1Prev.next = l1;
        if (currP1PrevRow === currP1Row) {
          direction = "horizontal";
        } else {
          if (currP1PrevCol === currP1Col) {
            direction = "vertical-up";
          } else {
            direction = "diagonal-up";
          }
        }
        if (direction !== "horizontal") {
          arrows[currP1PrevRow === 0 ? 1 : 3][currP1PrevCol + 1] = "";
          arrows[2][
            direction === "vertical-up" ? currP1PrevCol : currP1PrevCol + 1
          ] = direction;
        }
        this.setState({ arrows });
        await sleep(this.props.speed + 1000);
      }
    }

    if (!l1) {
      l1Prev.next = l2;
      if (currP1PrevRow === currP2Row) {
        direction = "horizontal";
      } else {
        if (currP1PrevCol === currP2Col) {
          direction = "vertical-down";
        } else {
          direction = "diagonal-down";
        }
      }
      if (direction !== "horizontal") {
        arrows[currP1PrevRow][currP1PrevCol + 1] = "";
        arrows[2][
          direction === "vertical-down" ? currP1PrevCol : currP1PrevCol + 1
        ] = direction;
      }
      this.setState({ arrows });
      await sleep(this.props.speed + 1000);
    }
    this.setState({ simulationIsRunning: false, simulationIsComplete: true });
  };

  getSquareStyle = (i, j) => {
    let style = "gridSquare-node ";

    if (this.isNodeCell(i, j)) {
      style += "border-black ";
    }

    return style;
  };

  isFirstNullCell = (i, j) => {
    return i === 1 && j === 0;
  };

  areLastNullCells = (j) => {
    return j === gridWidth - 1;
  };

  isInitialArrowCell = (i, j) => {
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
    if (i === p1Px && j === p1Py) {
      if (p1Px === p1x && p1Py === p1y) {
        return "p1Prev, p1";
      } else if (p1Px === p2x && p1Py === p2y) {
        return "p1Prev, p2";
      } else {
        return "p1Prev";
      }
    } else if (i === p1x && j === p1y) {
      return "p1";
    } else if (i === p2x && j === p2y) {
      return "p2";
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

    const arrowDirection = this.state.arrows[i][j];
    if (arrowDirection) {
      return <Arrow dims={nodeDims} direction={arrowDirection} />;
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
