import React from "react";
import description from "../../algoProblemDescriptions/boggle";
import AlgoHeader from "../../components/AlgoHeader";
import { sleep } from "../../services/utilities";

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

const colors = { 0: "white", 1: "blue" };

const gridHeight = 7;
const gridWidth = 15;

const sleepDelay = 75;

const initialStatePresets = {
  simulationIsRunning: false,
  simulationIsComplete: false,
  board: [],
  visiting: [],
  currNode: [-1, -1],
};

class Boggle extends React.Component {
  componentDidMount() {
    this.randomizeBoardAndWords();
  }

  randomizeBoardAndWords = () => {};

  findWords = (board, words) => {
    const trie = new Trie(words);
    const foundWords = {};
    const visiting = board.map((r) => r.map((c) => false));
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        this.exploreNode(board, i, j, visiting, trie.root, foundWords);
      }
    }

    return Object.keys(foundWords);
  };

  exploreNode = (board, i, j, visiting, node, foundWords) => {
    if (visiting[i][j]) {
      return;
    }

    const char = board[i][j];
    if (!(char in node)) {
      return;
    }
    visiting[i][j] = true;
    node = node[char];
    if ("*" in node) {
      foundWords[node["*"]] = true;
    }

    for (let [x, y] of this.getUnvisitedNeighbors(board, i, j, visiting)) {
      this.exploreNode(board, x, y, visiting, node, foundWords);
    }

    visiting[i][j] = false;
  };

  getUnvisitedNeighbors = (board, i, j, visiting) => {
    const neighbors = [];

    //topleft
    if (i > 0 && j > 0 && !visiting[i - 1][j - 1]) {
      neighbors.push([i - 1, j - 1]);
    }

    //top
    if (i > 0 && !visiting[i - 1][j]) {
      neighbors.push([i - 1, j]);
    }

    //topright

    if (i > 0 && j < board[0].length - 1 && !visiting[i - 1][j + 1]) {
      neighbors.push([i - 1, j + 1]);
    }

    //left
    if (j > 0 && !visiting[i][j - 1]) {
      neighbors.push([i, j - 1]);
    }

    //right
    if (j < board[0].length - 1 && !visiting[i][j + 1]) {
      neighbors.push([i, j + 1]);
    }

    //bottomleft
    if (i < board.length - 1 && j > 0 && !visiting[i + 1][j - 1]) {
      neighbors.push([i + 1, j - 1]);
    }

    //bottom
    if (i < board.length - 1 && !visiting[i + 1][j]) {
      neighbors.push([i + 1, j]);
    }

    //bottomright
    if (
      i < board.length - 1 &&
      j < board[0].length - 1 &&
      !visiting[i + 1][j + 1]
    ) {
      neighbors.push([i + 1, j + 1]);
    }

    return neighbors;
  };

  renderButtonRow = () => {};

  renderGrid = () => {};

  render() {
    return (
      <div>
        <>
          <AlgoHeader title="Boggle Board" description={description} />
          {this.renderButtonRow()}
          {this.renderGrid()}
        </>
      </div>
    );
  }
}

export default Boggle;
