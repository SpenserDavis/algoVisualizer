import React from "react";

const description = (
  <div className="description">
    <p>
      You are given a two-dimensional array (a matrix) containing letters; this
      matrix represents a boggle board. You're also given a list of words.
    </p>
    <p>
      Write a function that returns an array of all the words contained in the
      boggle board. The final words don't need to be in any particular order.
    </p>
    <p>
      A word is constructed in the boggle board by connecting adjacent
      (horizontally, vertically, or diagonally) letters, without using any
      single letter at a given position more than once; while a word can have
      repeated letters, those repeated letters must come from different
      positions in the boggle board in order for the word to be contained in the
      board. Note that two or more words are allowed to overlap and use the same
      letters in the boggle board.
    </p>
  </div>
);

export default description;
