import React from "react";

const Header = ({ title, description }) => {
  return (
    <>
      <div className="row d-flex justify-content-center">
        <h5>{title}</h5>
      </div>
      <hr></hr>
      <div className="row">
        <h6>Description:</h6>
        {description}
      </div>
    </>
  );
};

export default Header;
