import React from "react";

const Rivers = React.lazy(() => import("./components/Rivers"));
const Apples = React.lazy(() => import("./components/Apples"));
const Topological = React.lazy(() => import("./components/Topological"));
const Boggle = React.lazy(() => import("./components/Boggle"));
const Loop = React.lazy(() => import("./components/Loop"));
const Airports = React.lazy(() => import("./components/Airports"));
const Dijkstra = React.lazy(() => import("./components/Dijkstra"));

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
    path: "/loop",
    name: "Find Loop",
    component: Loop,
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
