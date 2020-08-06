import React from "react";

const description = (
  <div className="description">
    <p>
      You are given a two-dimensional array (a matrix) of potentially unequal
      height and width containing only 0s and 1s. each 0 represents land, and
      each 1 represents part of a river. A river consists of any number of 1s
      that are either horizontally or vertically adjacent (but not diagonally
      adjacent). The number of adjacent 1s forming a river determine its size.
    </p>
    <p>
      Note that a river can twist. In other words, it doesn't have to be a
      straight vertical line or a straight horizontal line; it can be L-shaped,
      for example.
    </p>
    <p>
      Write a function that returns an array of the sizes of all rivers
      represented in the input matrix. The sizes don't need to be in any
      particular order.
    </p>
  </div>
);

export default description;
