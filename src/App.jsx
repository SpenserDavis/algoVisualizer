import React from "react";
import Menu from "./components/Menu";
import DisplayArea from "./components/ContentRoutes";
import "./App.css";
import SiteHeader from "./components/SiteHeader";
import { BrowserRouter } from "react-router-dom";

class App extends React.Component {
  state = {
    speed: 50,
  };

  handleSpeedChange = (speed) => {
    this.setState({ speed });
  };

  render() {
    const { speed } = this.state;
    return (
      <div className="App">
        <div className="container">
          <SiteHeader
            handleSpeedChangeRequest={this.handleSpeedChange}
            speed={speed}
          />
          <br />
          <div className="row pageContent">
            <BrowserRouter>
              <Menu />
              <DisplayArea speed={speed} />
            </BrowserRouter>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
