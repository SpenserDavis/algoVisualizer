export function dijkstra(grid, startingNode, destinationNode) {
  const visitedNodesInOrder = [];
  startingNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) {
      continue;
    }

    if (closestNode.distance === Infinity) {
      return visitedNodesInOrder;
    }
    closestNode.visited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === destinationNode) {
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.prev = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors.filter((neighbor) => !neighbor.visited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrder(destinationNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = destinationNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.prev;
  }
  return nodesInShortestPathOrder;
}
