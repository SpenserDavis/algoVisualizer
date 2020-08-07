import React from "react";

const Rivers = React.lazy(() => import("./components/Algos/Rivers"));
const Apples = React.lazy(() => import("./components/Algos/Apples"));
const Topological = React.lazy(() => import("./components/Algos/Topological"));
const Boggle = React.lazy(() => import("./components/Algos/Boggle"));
const Merge = React.lazy(() => import("./components/Algos/Merge"));
const Airports = React.lazy(() => import("./components/Algos/Airports"));
const Dijkstra = React.lazy(() => import("./components/Algos/Dijkstra"));

export const routes = [
  {
    path: "/apples",
    name: "Rotten Apples",
    component: Apples,
  },
  {
    path: "/rivers",
    name: "River Sizes",
    component: Rivers,
  },
  {
    path: "/topologicalsort",
    name: "Topological Sort",
    component: Topological,
  },
  {
    path: "/boggle",
    name: "Boggle Board",
    component: Boggle,
  },
  {
    path: "/merge",
    name: "Merge Lists",
    component: Merge,
  },
  {
    path: "/airports",
    name: "Airport Connections",
    component: Airports,
  },
  {
    path: "/dijkstra",
    name: "Shortest Path",
    component: Dijkstra,
  },
];
