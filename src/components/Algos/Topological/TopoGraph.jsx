import React from "react";
import * as d3 from "d3";
import "./topo.css";
import { sleep } from "../../../services/utilities";

class JobGraph {
  constructor(jobs) {
    this.graph = {};
    this.nodes = [];
    for (let job of jobs) {
      this.addJob(job);
    }
  }

  addJob(job) {
    this.graph[job] = new JobNode(job);
    this.nodes.push(this.graph[job]);
  }

  getJob(job) {
    if (!(job in this.graph)) {
      this.addJob(job);
    }
    return this.graph[job];
  }

  addPrereq(prereq, job) {
    let prereqNode = this.getJob(prereq);
    let jobNode = this.getJob(job);
    jobNode.prereqs.push(prereqNode);
  }
}

class JobNode {
  constructor(job) {
    this.job = job;
    this.prereqs = [];
    this.visiting = false;
    this.visited = false;
  }
}

let originPointsIdx = 0;
const originPoints = [
  [40, 40],
  [880, 40],
  [880, 440],
  [40, 440],
];

class TopoGraph extends React.Component {
  componentDidMount() {
    this.initializeGraph();
  }

  initializeGraph = async () => {
    const width = 920;
    const height = 480;
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    // set up SVG for D3
    const svg = configureSvg(width, height);

    // set up initial nodes and links
    //  - nodes are known by 'id', not by index in array.
    //  - reflexive edges are indicated on the node (as a bold black circle).
    //  - links are always source < target; edge directions are set by 'left' and 'right'.
    const nodes = [
      //   { id: 0, reflexive: false },
    ];
    let lastNodeId = 0;
    const links = [
      //   { source: nodes[0], target: nodes[1], left: false, right: true },
    ];

    // init D3 force layout
    const force = configureForce();

    // init D3 drag support
    const drag = configureDrag();

    configureArrowMarkers();

    // line displayed when dragging new nodes
    const dragLine = svg
      .append("svg:path")
      .attr("class", "link dragline hidden")
      .attr("d", "M0,0L0,0");

    // handles to link and node element groups
    let path = svg.append("svg:g").selectAll("path");
    let circle = svg.append("svg:g").selectAll("g");

    // mouse event vars
    let selectedNode = null;
    let selectedLink = null;
    let mousedownLink = null;
    let mousedownNode = null;
    let mouseupNode = null;

    addFilterAttributes();

    //preserving names of functions for future improvements to app
    svg.on("x", mousedown).on("y", mousemove).on("z", mouseup);
    d3.select(window).on("keydown", keydown).on("keyup", keyup);

    restart();

    // algo starts here

    const {
      jobs,
      deps,
      speed,
      updateOrderedJobs,
      onSimulationCompletion,
    } = this.props;

    const topologicalSort = async () => {
      let jobGraph = new JobGraph(jobs);
      for (let job of jobs) {
        await sleep(speed);
        mousedown();
      }
      await sleep(speed);

      for (let [prereq, job] of deps) {
        jobGraph.addPrereq(prereq, job);
        await sleep(speed);
        d3.select(`[node-number="${job}"]`).dispatch("mousedown");
        await sleep(speed);
        d3.select(`[node-number='${prereq}']`).dispatch("mouseup");
      }

      await sleep(speed);

      const orderedJobs = await getOrderedJobs(jobGraph);
      onSimulationCompletion(orderedJobs);
      await sleep(speed);
    };

    const getOrderedJobs = async (graph) => {
      await sleep(speed);
      let orderedJobs = [];
      for (let node of graph.nodes) {
        highlightNode(node, "#currNode");
        await sleep(speed);
        let cyclic = await dftSearch(node, orderedJobs);

        if (cyclic) {
          return [];
        }
      }

      return orderedJobs;
    };

    const dftSearch = async (node, orderedJobs) => {
      highlightNode(node, "#visiting");
      await sleep(speed);
      if (node.visited) {
        highlightNode(node, "#visited");
        await sleep(speed);
        return false;
      }
      if (node.visiting) {
        return true;
      }
      node.visiting = true;
      for (let prereq of node.prereqs) {
        highlightLink(node, prereq, "#visiting");
        await sleep(speed);
        let cyclic = await dftSearch(prereq, orderedJobs);
        highlightLink(node, prereq, "none");
        await sleep(speed);
        if (cyclic) {
          return true;
        }
      }

      node.visiting = false;
      node.visited = true;
      highlightNode(node, "#visited");
      await sleep(speed);
      orderedJobs.push(node.job);
      updateOrderedJobs(orderedJobs);
    };

    topologicalSort();

    // function definitions below, no more algo logic

    function highlightNode(node, filter) {
      d3.select(`[node-number='${node.job}']`).attr("filter", `url(${filter})`);
    }

    function highlightLink(node, prereq, filter) {
      d3.select(`[node-link='${node.job}-${prereq.job}']`).attr(
        "filter",
        `url(${filter})`
      );
      d3.select(`[node-link='${prereq.job}-${node.job}']`).attr(
        "filter",
        `url(${filter})`
      );
    }

    function configureSvg(width, height) {
      return d3
        .select("#topoGraph")
        .append("svg")
        .on("contextmenu", () => {
          d3.event.preventDefault();
        })
        .attr("width", width)
        .attr("height", height);
    }

    function resetMouseVars() {
      mousedownNode = null;
      mouseupNode = null;
      mousedownLink = null;
    }

    // update force layout (called automatically each iteration)
    function tick() {
      // draw directed edges with proper padding from node centers
      path.attr("d", (d) => {
        const deltaX = d.target.x - d.source.x;
        const deltaY = d.target.y - d.source.y;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / dist;
        const normY = deltaY / dist;
        const sourcePadding = d.left ? 17 : 12;
        const targetPadding = d.right ? 17 : 12;
        const sourceX = d.source.x + sourcePadding * normX;
        const sourceY = d.source.y + sourcePadding * normY;
        const targetX = d.target.x - targetPadding * normX;
        const targetY = d.target.y - targetPadding * normY;

        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });

      circle.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    // update graph (called when needed)
    function restart() {
      // path (link) group
      path = path.data(links);

      // update existing links
      path
        .classed("selected", (d) => d === selectedLink)
        .style("marker-start", (d) => (d.left ? "url(#start-arrow)" : ""))
        .style("marker-end", (d) => (d.right ? "url(#end-arrow)" : ""));

      // remove old links
      path.exit().remove();

      // add new links

      path = path
        .enter()
        .append("svg:path")
        .attr("class", "link")
        .attr("node-link", (d) => `${d.target.id}-${d.source.id}`)
        .classed("selected", (d) => d === selectedLink)
        .style("marker-start", (d) => (d.left ? "url(#start-arrow)" : ""))
        .style("marker-end", (d) => (d.right ? "url(#end-arrow)" : ""))
        .on("mousedown", (d) => {
          if (d3.event.ctrlKey) return;

          // select link
          mousedownLink = d;
          selectedLink = mousedownLink === selectedLink ? null : mousedownLink;
          selectedNode = null;
          restart();
        })
        .merge(path);

      // circle (node) group
      // NB: the function arg is crucial here! nodes are known by id, not by index!
      circle = circle.data(nodes, (d) => d.id);

      // update existing nodes (reflexive & selected visual states)
      circle
        .selectAll("circle")
        .style("fill", (d) =>
          d === selectedNode
            ? d3.rgb(colors(d.id)).brighter().toString()
            : colors(d.id)
        )
        .classed("reflexive", (d) => d.reflexive);

      // remove old nodes
      circle.exit().remove();

      // add new nodes
      const g = circle.enter().append("svg:g");

      g.append("svg:circle")
        .attr("class", "node")
        .attr("node-number", (d) => d.id)
        .attr("r", 30)
        .style("fill", (d) =>
          d === selectedNode
            ? d3.rgb(colors(d.id)).brighter().toString()
            : colors(d.id)
        )
        .style("stroke", (d) => d3.rgb(colors(d.id)).darker().toString())
        .classed("reflexive", (d) => d.reflexive)
        .on("mouseover", function (d) {
          if (!mousedownNode || d === mousedownNode) return;
          // enlarge target node
          d3.select(this).attr("transform", "scale(1.1)");
        })
        .on("mouseout", function (d) {
          if (!mousedownNode || d === mousedownNode) return;
          // unenlarge target node
          d3.select(this).attr("transform", "");
        })
        .on("mousedown", (d) => {
          if (d3.event.ctrlKey) return;

          // select node
          mousedownNode = d;
          selectedNode = mousedownNode === selectedNode ? null : mousedownNode;
          selectedLink = null;

          // reposition drag line
          dragLine
            .style("marker-end", "url(#end-arrow)")
            .classed("hidden", false)
            .attr(
              "d",
              `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`
            );

          restart();
        })
        .on("mouseup", function (d) {
          if (!mousedownNode) return;

          // needed by FF
          dragLine.classed("hidden", true).style("marker-end", "");

          // check for drag-to-self
          mouseupNode = d;
          if (mouseupNode === mousedownNode) {
            resetMouseVars();
            return;
          }

          // unenlarge target node
          d3.select(this).attr("transform", "");

          // add link to graph (update if exists)
          // NB: links are strictly source < target; arrows separately specified by booleans
          const isRight = mousedownNode.id < mouseupNode.id;
          const source = isRight ? mousedownNode : mouseupNode;
          const target = isRight ? mouseupNode : mousedownNode;

          const link = links.filter(
            (l) => l.source === source && l.target === target
          )[0];
          if (link) {
            link[isRight ? "right" : "left"] = true;
          } else {
            links.push({ source, target, left: !isRight, right: isRight });
          }

          // select new link
          selectedLink = link;
          selectedNode = null;
          restart();
        });

      // show node IDs
      g.append("svg:text")
        .attr("x", 0)
        .attr("y", 4)
        .attr("class", "id")
        .text((d) => d.id);

      circle = g.merge(circle);

      // set the graph in motion
      force.nodes(nodes).force("link").links(links);

      force.alphaTarget(0.3).restart();
    }

    function mousedown() {
      // because :active only works in WebKit?

      let point = originPoints[originPointsIdx++ % originPoints.length];

      const node = {
        id: ++lastNodeId,
        reflexive: true,
        x: point[0],
        y: point[1],
      };
      nodes.push(node);

      restart();
    }

    function mouseup() {
      if (mousedownNode) {
        // hide drag line
        dragLine.classed("hidden", true).style("marker-end", "");
      }

      // because :active only works in WebKit?
      svg.classed("active", false);

      // clear mouse event vars
      resetMouseVars();
    }

    function mousemove() {
      if (!mousedownNode) return;

      // update drag line
      dragLine.attr(
        "d",
        `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${
          d3.mouse(this)[1]
        }`
      );
    }

    function spliceLinksForNode(node) {
      const toSplice = links.filter(
        (l) => l.source === node || l.target === node
      );
      for (const l of toSplice) {
        links.splice(links.indexOf(l), 1);
      }
    }

    // only respond once per keydown
    let lastKeyDown = -1;

    function keydown() {
      d3.event.preventDefault();

      if (lastKeyDown !== -1) return;
      lastKeyDown = d3.event.keyCode;

      // ctrl
      if (d3.event.keyCode === 17) {
        circle.call(drag);
        svg.classed("ctrl", true);
        return;
      }

      if (!selectedNode && !selectedLink) return;

      switch (d3.event.keyCode) {
        case 8: // backspace
        case 46: // delete
          if (selectedNode) {
            nodes.splice(nodes.indexOf(selectedNode), 1);
            spliceLinksForNode(selectedNode);
          } else if (selectedLink) {
            links.splice(links.indexOf(selectedLink), 1);
          }
          selectedLink = null;
          selectedNode = null;
          restart();
          break;
        case 66: // B
          if (selectedLink) {
            // set link direction to both left and right
            selectedLink.left = true;
            selectedLink.right = true;
          }
          restart();
          break;
        case 76: // L
          if (selectedLink) {
            // set link direction to left only
            selectedLink.left = true;
            selectedLink.right = false;
          }
          restart();
          break;
        case 82: // R
          if (selectedNode) {
            // toggle node reflexivity
            selectedNode.reflexive = !selectedNode.reflexive;
          } else if (selectedLink) {
            // set link direction to right only
            selectedLink.left = false;
            selectedLink.right = true;
          }
          restart();
          break;
        default:
          break;
      }
    }

    function keyup() {
      lastKeyDown = -1;

      // ctrl
      if (d3.event.keyCode === 17) {
        circle.on(".drag", null);
        svg.classed("ctrl", false);
      }
    }

    function addFilterAttributes() {
      const visited = svg.append("defs").append("filter").attr("id", "visited");
      const visiting = svg
        .append("defs")
        .append("filter")
        .attr("id", "visiting");
      const currNode = svg
        .append("defs")
        .append("filter")
        .attr("id", "currNode");

      const nodeStatus = [visited, visiting, currNode];

      visited
        .append("feColorMatrix")
        .attr("type", "matrix")
        .attr("values", "1 1 1 1 1  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0");

      visiting
        .append("feColorMatrix")
        .attr("type", "matrix")
        .attr("values", "0 0 0 0 0  1 1 1 1 1  0 0 0 0 0  0 0 0 1 0");

      currNode
        .append("feColorMatrix")
        .attr("type", "matrix")
        .attr("values", "1 1 1 1 1  1 1 1 1 1  0 0 0 0 0  0 0 0 1 0");

      for (let status of nodeStatus) {
        status
          .append("feGaussianBlur")
          .attr("stdDeviation", 5)
          .attr("result", "coloredBlur");
        const merge = status.append("feMerge");
        merge.append("feMergeNode").attr("in", "coloredBlur");
        merge.append("feMergeNode").attr("in", "SourceGraphic");
      }
    }

    function configureArrowMarkers() {
      // define arrow markers for graph links
      svg
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", "end-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#000");

      svg
        .append("svg:defs")
        .append("svg:marker")
        .attr("id", "start-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", -5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M10,-5L0,0L10,5")
        .attr("fill", "#000");
    }

    function configureForce() {
      return d3
        .forceSimulation()
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d.id)
            .distance(300)
        )
        .force("charge", d3.forceManyBody().strength(-500))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .on("tick", tick);
    }

    function configureDrag() {
      return (
        d3
          .drag()
          // Mac Firefox doesn't distinguish between left/right click when Ctrl is held...
          .filter(() => d3.event.button === 0 || d3.event.button === 2)
          .on("start", (d) => {
            if (!d3.event.active) force.alphaTarget(0.3).restart();

            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on("end", (d) => {
            if (!d3.event.active) force.alphaTarget(0);

            d.fx = null;
            d.fy = null;
          })
      );
    }
  };

  render() {
    return <div className="nodeGraph" id="topoGraph"></div>;
  }
}

export default TopoGraph;

// including Ross' license disclosures below since I borrowed heavily from his d3 graph code

// LICENSE# (http://bl.ocks.org/rkirsling/5001347)
// Copyright (c) 2013 Ross Kirsling

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
