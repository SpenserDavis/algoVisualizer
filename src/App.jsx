import React from "react";
import Menu from "./components/Menu";
import DisplayArea from "./components/ContentRoutes";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row pageHeader">
          <h2>Algorithm Visualizer</h2>
        </div>
        <div className="row pageContent">
          <BrowserRouter>
            <Menu />
            <DisplayArea />
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
