import React from "react";
import Menu from "./components/Menu";
import DisplayArea from "./components/ContentRoutes";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

const speeds = {
  Slow: 200,
  Medium: 100,
  Fast: 50,
};

class App extends React.Component {
  state = {
    speed: 50,
  };

  handleSpeedChange = (e) => {
    const { value } = e.target;
    console.log(e.target);
    this.setState({ speed: parseInt(value) });
  };

  renderRadioButtons = () =>
    Object.keys(speeds).map((speed, i) => (
      <div key={`speed-${i}`} className="form-check speed-button float-right">
        <input
          className="form-check-input"
          type="radio"
          name={speed}
          value={speeds[speed]}
          checked={this.state.speed === speeds[speed]}
          onChange={this.handleSpeedChange}
        />
        <label className="form-check-label" htmlFor={speed}>
          {speed}
        </label>
      </div>
    ));

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row pageHeader">
            <h2>Algorithm Visualizer</h2>
          </div>
          {this.renderRadioButtons()}
          <br />
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
}

export default App;
