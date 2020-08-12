import React from "react";

const description = (
  <div className="description">
    <p>
      You are given a list of airports (three-letter codes like "JFK"), a list
      of routes (one-way flights from one airport to another like
      ["JFK","SFO"]), and a starting airport.
    </p>
    <p>
      Write a function that returns the minimum number of airport connections
      (one-way flights) that need to be added in order for someone to be able to
      reach any airport in the list, starting at the starting airport.
    </p>
    <p>
      Note that routes only allow you to fly in one direction; for instance, the
      route ["JFK", "SFO"] only allows you to fly from "JFK" to "SFO".
    </p>
    <p>
      Also note that the connections don't have to be direct; it's okay if an
      airport can only be reached from the starting airport by stopping at other
      airports first.
    </p>
  </div>
);

export default description;
