import React from "react";

const description = (
  <div className="description">
    <p>
      You're given a list of arbitrary jobs that need to be completed; these
      jobs are represented by distinct integers. You're also given a list of
      dependencies. A dependency is represented as a pair of jobs where the
      first job is a prerequisite of the second one. In other words, the second
      job depends on the first one; it can only be completed once the first job
      is completed.
    </p>
    <p>
      Write a function that takes in a list of jobs and a list of dependencies
      and returns a list containing a valid order in which the given jobs can be
      completed. If no such order exists, the function should return an empty
      array.
    </p>
  </div>
);

export default description;
