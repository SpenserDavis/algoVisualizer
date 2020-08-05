import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../router";
import { withRouter } from "react-router-dom";

const Menu = (props) => {
  if (props.location.pathname === "/") {
    props.history.push("/apples");
  }
  return (
    <div className="col-2 menu-container">
      <div className="menu">
        {routes.map((route, i) => {
          let isActiveTab =
            route.path === props.location.pathname ? "active" : "";

          return (
            <Link to={route.path} key={`menuLink-${i}`}>
              <button className={`menuButton ${isActiveTab}`}>
                {route.name}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default withRouter(Menu);
