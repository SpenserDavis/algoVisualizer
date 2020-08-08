import React from "react";
import description from "../../algoProblemDescriptions/boggle";
import AlgoHeader from "../../components/AlgoHeader";
import { sleep, shuffle } from "../../services/utilities";

class Trie {
  constructor(words) {
    this.root = {};
    this.endSymbol = "*";
    for (let word of words) {
      this.addWord(word);
    }
  }

  addWord(word) {
    let node = this.root;
    for (let char of word) {
      if (!(char in node)) {
        node[char] = {};
      }
      node = node[char];
    }
    node[this.endSymbol] = word;
  }
}

const wordList = {
  1: ["a"],
  2: ["as", "to", "if", "am", "of", "at"],
  3: ["the", "act", "abs", "ate", "eve", "bat", "beg", "cat", "dad", "boo"],
  4: ["sins", "aloe", "dune", "eats", "geek", "hive", "knee"],
  5: ["match", "noise", "organ", "patio", "react"],
  6: ["status", "tether", "upward", "voting", "winnow", "yankee", "zygote"],
};

const charList = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const colors = { word: "brown", gibberish: "white" };

const gridHeight = 7;
const gridWidth = 15;

const initialStatePresets = {
  simulationIsRunning: false,
  simulationIsComplete: false,
  board: [],
  currNode: [-1, -1],
  foundWords: {},
  targetWords: [],
};

class Boggle extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      ...initialStatePresets,
    };
  }

  componentDidMount() {
    this.randomizeBoardAndWords();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  randomizeBoardAndWords = () => {
    this.setState({ simulationIsComplete: false });
    const targetWords = [];
    for (let letterCountKey in wordList) {
      const randIdx = Math.floor(
        Math.random() * wordList[letterCountKey].length
      );

      targetWords.push(wordList[letterCountKey][randIdx]);
    }
    const cellTemplate = {
      char: "",
      visiting: false,
      charInWord: false,
    };
    const board = new Array(gridHeight)
      .fill("")
      .map((row) =>
        new Array(gridWidth).fill(0).map((v) => ({ ...cellTemplate }))
      );

    let targetWordIdx = 0;
    while (targetWordIdx < targetWords.length) {
      const currWord = targetWords[targetWordIdx].split("");

      let wordHasBeenAdded = false;
      while (!wordHasBeenAdded) {
        const i = Math.floor(Math.random() * gridHeight);
        const j = Math.floor(Math.random() * gridWidth);

        wordHasBeenAdded = this.tryPlaceWord(i, j, board, currWord, 0);

        if (wordHasBeenAdded) {
          targetWordIdx++;
        }
      }
    }

    this.populateEmptyCells(board);

    this.setState({ targetWords, board });
  };

  tryPlaceWord = (i, j, board, currWord, currCharIdx) => {
    const location = board[i][j];
    if (location.visiting) {
      return false;
    }
    const currChar = currWord[currCharIdx];

    if (location.char !== "" && location.char !== currChar) {
      return false;
    }
    location.visiting = true;

    let wordHasBeenAdded = false;
    const prevChar = location.char;
    location.char = currChar;
    if (currCharIdx === currWord.length - 1) {
      location.visiting = false;

      return true;
    }

    const neighbors = shuffle(this.getUnvisitedNeighbors(board, i, j));
    for (let [x, y] of neighbors) {
      wordHasBeenAdded = this.tryPlaceWord(
        x,
        y,
        board,
        currWord,
        currCharIdx + 1
      );
      if (wordHasBeenAdded) {
        location.visiting = false;

        return true;
      }
    }

    location.char = prevChar;
    location.visiting = false;
    return false;
  };

  populateEmptyCells = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j].char === "") {
          board[i][j].char =
            charList[Math.floor(Math.random() * charList.length)];
        }
      }
    }
  };

  findWords = async () => {
    this.setState({ simulationIsRunning: true });
    const { board, targetWords } = this.state;
    const trie = new Trie(targetWords);
    const foundWords = {};

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        await this.exploreNode(board, i, j, trie.root, foundWords);
      }
    }

    this._isMounted &&
      this.setState({
        foundWords,
        simulationIsComplete: true,
        simulationIsRunning: false,
        currNode: [-1, -1],
      });
  };

  exploreNode = async (board, i, j, node, foundWords) => {
    this._isMounted && this.setState({ currNode: [i, j] });
    await sleep(this.props.speed);
    let wordIsFound = false;
    const location = board[i][j];
    if (location.visiting) {
      return;
    }

    const { char } = location;
    if (!(char in node)) {
      return;
    }
    location.visiting = true;
    node = node[char];
    if ("*" in node) {
      foundWords[node["*"]] = true;
      this._isMounted && this.setState({ foundWords });
      wordIsFound = true;
      location.charInWord = true;
    }

    for (let [x, y] of this.getUnvisitedNeighbors(board, i, j)) {
      let anotherWordIsFound = await this.exploreNode(
        board,
        x,
        y,
        node,
        foundWords
      );
      if (anotherWordIsFound) {
        location.charInWord = true;
        wordIsFound = true;
      }
    }

    location.visiting = false;
    return wordIsFound;
  };

  getUnvisitedNeighbors = (board, i, j) => {
    const neighbors = [];

    //topleft
    if (i > 0 && j > 0 && !board[i - 1][j - 1].visiting) {
      neighbors.push([i - 1, j - 1]);
    }

    //top
    if (i > 0 && !board[i - 1][j].visiting) {
      neighbors.push([i - 1, j]);
    }

    //topright
    if (i > 0 && j < board[0].length - 1 && !board[i - 1][j + 1].visiting) {
      neighbors.push([i - 1, j + 1]);
    }

    //left
    if (j > 0 && !board[i][j - 1].visiting) {
      neighbors.push([i, j - 1]);
    }

    //right
    if (j < board[0].length - 1 && !board[i][j + 1].visiting) {
      neighbors.push([i, j + 1]);
    }

    //bottomleft
    if (i < board.length - 1 && j > 0 && !board[i + 1][j - 1].visiting) {
      neighbors.push([i + 1, j - 1]);
    }

    //bottom
    if (i < board.length - 1 && !board[i + 1][j].visiting) {
      neighbors.push([i + 1, j]);
    }

    //bottomright
    if (
      i < board.length - 1 &&
      j < board[0].length - 1 &&
      !board[i + 1][j + 1].visiting
    ) {
      neighbors.push([i + 1, j + 1]);
    }

    return neighbors;
  };

  getSquareStyles = (i, j) => {
    const { currNode, board } = this.state;
    const location = board[i][j];
    const [x, y] = currNode;
    const currNodeClass = i === x && j === y ? "currNode" : "";

    const visitingNodeClass = location.visiting ? "visitingNode" : "";

    const colorClass = location.charInWord
      ? colors["word"]
      : colors["gibberish"];
    const wordNode = location.charInWord ? "wordNode" : "";
    return `gridSquare ${colorClass} ${currNodeClass} ${visitingNodeClass} ${wordNode}`;
  };

  renderButtonRow = () => {
    const {
      simulationIsRunning,
      simulationIsComplete,
      foundWords,
    } = this.state;
    return (
      <div className="row d-flex justify-content-between">
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning}
            onClick={this.randomizeBoardAndWords}
            className="btn btn-primary"
          >
            Randomize Board
          </button>
        </div>
        <div className="col d-flex justify-content-center">
          <button
            disabled={simulationIsRunning || simulationIsComplete}
            onClick={this.findWords}
            className="btn btn-success"
          >
            Run Simulation
          </button>
        </div>
        <div className="col d-flex justify-content-center align-items-end">
          <h6
            className={`no-wrap ${
              simulationIsComplete ? "simCompleteBox" : ""
            }`}
          >
            Found Words: <br></br>
            {(simulationIsRunning || simulationIsComplete) &&
              `[${Object.keys(foundWords).join(", ")}]`}
          </h6>
        </div>
      </div>
    );
  };

  renderGrid = () => {
    const { board } = this.state;
    return (
      <div className="row grid">
        <div className="col">
          {board.length > 0 &&
            board.map((r, i) => (
              <div
                className="row d-flex justify-content-center"
                key={`boardRow-${i}`}
              >
                {r.map((o, j) => (
                  <div key={`boardCol-${j}`}>
                    <div className={this.getSquareStyles(i, j)}> {o.char}</div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <>
          <AlgoHeader title="Boggle Board" description={description} />
          {this.renderButtonRow()}
          <div id="target-words" className="row d-flex align-items-start">
            <strong className="no-wrap">Target Words: </strong>
            <span>{this.state.targetWords.join(", ")}</span>
          </div>
          {this.renderGrid()}
        </>
      </div>
    );
  }
}

export default Boggle;
