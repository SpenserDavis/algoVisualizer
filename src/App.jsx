import React from "react";
import Menu from "./components/Menu";
import DisplayArea from "./components/DisplayArea";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <h2>Algorithm Visualizer</h2>
        </div>
        <div className="row">
          <Menu />
          <DisplayArea />
        </div>
      </div>
    </div>
  );
}

export default App;
