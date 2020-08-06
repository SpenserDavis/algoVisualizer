import React from "react";

const description = (
  <div className="description">
    <p>
      You are given a matrix of dimensions m*n. Each cell in the matrix has the
      value 0, 1, or 2. These values correspond to the following:
    </p>
    <pre>
      0: Cell is empty
      <br></br>
      1: Cell contains a fresh apple
      <br></br>
      2: Cell contains a rotten apple
    </pre>
    <p>
      Each day, a rotten apple at index [i, j] can rot all adjacent fresh apples
      at indices [i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1] (up, down, left,
      and right). Determine the minimum number of days required such that all
      apples become rotten. If it is impossible to rot every apple then return
      -1.
    </p>
  </div>
);

export default description;
