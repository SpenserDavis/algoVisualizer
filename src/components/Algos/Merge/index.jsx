import React from "react";
import description from "../../../algoProblemDescriptions/merge";
import AlgoHeader from "../../AlgoHeader";
import "./merge.css";
import { sleep } from "../../../services/utilities";
import { ArcherContainer, ArcherElement } from "react-archer";

const listSize = 5;
const gridWidth = listSize * 2 + 3;
const gridHeight = 5;

const initialPointerPresets = {
  p1: [-1, -1],
  p2: [-1, -1],
  p1Prev: [-1, -1],
};

class Merge extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      speed: 0,
      listOne: [],
      listTwo: [],
      simulationIsRunning: false,
      simulationIsComplete: false,
      ...initialPointerPresets,
    };
  }

  static getDerivedStateFromProps(props) {
    return { speed: props.speed * 10 };
  }

  componentDidMount() {
    this.initializeLists();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initializeLists = () => {
    const listOne = this.generateNewList(1);
    const listTwo = this.generateNewList(3);

    // test case
    // const listOne = [
    //   { value: 1, next: [1, 4] },
    //   { value: 2, next: [1, 6] },
    //   { value: 3, next: [1, 8] },
    //   { value: 5, next: [1, 10] },
    //   { value: 9, next: [1, 12] },
    // ];
    // const listTwo = [
    //   { value: 5, next: [3, 4] },
    //   { value: 6, next: [3, 6] },
    //   { value: 7, next: [3, 8] },
    //   { value: 8, next: [3, 10] },
    //   { value: 8, next: [3, 12] },
    // ];

    this._isMounted &&
      this.setState({
        listOne,
        listTwo,
        ...initialPointerPresets,
        simulationIsComplete: false,
      });
  };

  generateNewList = (listRow) => {
    const arr = new Array(listSize);
    for (let i = 0; i < listSize; i++) {
      const randInt = Math.floor(Math.random() * 10);
      arr[i] = { value: randInt, next: [-1, -1] };
    }
    arr.sort((a, b) => a.value - b.value);
    for (let i = 0; i < listSize; i++) {
      arr[i].next = [listRow, 2 * i + 4];
    }

    return arr;
  };

  performMerge = async () => {
    this._isMounted &&
      this.setState({
        simulationIsRunning: true,
        p1: [0, 2],
        p2: [4, 2],
        p1Prev: [0, 0],
      });
    await sleep(this.state.speed);
    const { p1, p2, p1Prev, listOne, listTwo, speed } = this.state;

    let l1 = listOne.slice();
    let l2 = listTwo.slice();

    let [currP1Row, currP1Col] = p1;

    let [currP2Row, currP2Col] = p2;

    let [currP1PrevRow, currP1PrevCol] = p1Prev;

    let idx1 = 0;
    let idx2 = 0;

    while (idx1 < l1.length && idx2 < l1.length) {
      if (l1[idx1].value < l2[idx2].value) {
        this._isMounted && this.setState({ p1Prev: [0, currP1Col] });
        currP1PrevCol = currP1Col;
        currP1PrevRow = currP1Row;
        await sleep(speed);

        this._isMounted && this.setState({ p1: [0, currP1Col + 2] });
        idx1++;
        currP1Col += 2;
        await sleep(speed);
      } else {
        if (currP1PrevCol > 0) {
          if (currP1PrevRow === 0) {
            l1[currP1PrevCol / 2 - 1].next = [3, currP2Col];
          } else {
            l2[currP1PrevCol / 2 - 1].next = [3, currP2Col];
          }

          this._isMounted && this.setState({ listOne: l1, listTwo: l2 });
          await sleep(speed);
        }

        this._isMounted && this.setState({ p1Prev: [4, currP2Col] });
        currP1PrevCol = currP2Col;
        currP1PrevRow = currP2Row;
        await sleep(speed);

        idx2++;
        this._isMounted && this.setState({ p2: [4, currP2Col + 2] });
        currP2Col += 2;
        await sleep(speed);

        if (currP1PrevRow === 0) {
          l1[currP1PrevCol / 2 - 1].next = [1, currP1Col];
        } else {
          l2[currP1PrevCol / 2 - 1].next = [1, currP1Col];
        }

        this._isMounted && this.setState({ listOne: l1, listTwo: l2 });
        await sleep(speed);
      }
    }

    if (idx1 >= l1.length) {
      if (currP1PrevRow === 0) {
        l1[currP1PrevCol / 2 - 1].next = [3, currP2Col];
      } else {
        l2[currP1PrevCol / 2 - 1].next = [3, currP2Col];
      }

      this._isMounted && this.setState({ listOne: l1, listTwo: l2 });
      await sleep(speed);
    }

    this._isMounted &&
      this.setState({
        simulationIsRunning: false,
        simulationIsComplete: true,
        ...initialPointerPresets,
      });
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

  getCellValue = (i, j) => {
    if (this.isFirstNullCell(i, j)) {
      return "null";
    }

    const pointerCell = this.detectPointerCell(i, j);
    if (pointerCell) {
      return pointerCell;
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

  getAnchorRelations = (curr, idx, i) => {
    let targetId = `node-[${[curr[idx].next]}]`;
    let targetAnchor, sourceAnchor;
    let targetRow = curr[idx].next[0];

    if (targetRow === i) {
      targetAnchor = "left";
      sourceAnchor = "right";
    } else if (targetRow > i) {
      targetAnchor = "top";
      sourceAnchor = "bottom";
    } else {
      targetAnchor = "bottom";
      sourceAnchor = "top";
    }

    return {
      targetId,
      targetAnchor,
      sourceAnchor,
    };
  };

  renderLists = (listOne, listTwo) => {
    const grid = new Array(gridHeight).fill(0).map((row, i) => {
      let curr;
      if (i === 1) {
        curr = listOne;
      } else if (i === 3) {
        curr = listTwo;
      }

      let idx = -1;
      return (
        <div
          key={`LL-row-${i}`}
          className={`row d-flex justify-content-center listRow`}
        >
          {new Array(gridWidth).fill(0).map((v, j) => {
            if (this.isNodeCell(i, j)) {
              idx++;

              return (
                <ArcherElement
                  key={`LLnode-${i}-${j}`}
                  id={`node-[${[i, j]}]`}
                  relations={[this.getAnchorRelations(curr, idx, i)]}
                >
                  <div className={this.getSquareStyle(i, j)}>
                    {curr[idx].value}
                    {this.addTriangle(i, j)}
                  </div>
                </ArcherElement>
              );
            } else if (i % 2 !== 0 && this.areLastNullCells(j)) {
              return (
                <ArcherElement key={`LLnode-${i}-${j}`} id={`node-[${[i, j]}]`}>
                  <div className={this.getSquareStyle(i, j)}>
                    null
                    {this.addTriangle(i, j)}
                  </div>
                </ArcherElement>
              );
            } else {
              return (
                <div
                  key={`LLnode-${i}-${j}`}
                  className={this.getSquareStyle(i, j)}
                >
                  {this.getCellValue(i, j)}
                  {this.addTriangle(i, j)}
                </div>
              );
            }
          })}
        </div>
      );
    });
    return <ArcherContainer strokeColor="black">{grid}</ArcherContainer>;
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
