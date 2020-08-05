import React from "react";

const handleButtonClick = () => {};

const test = ["something", "another thing"];

const Menu = () => {
  return (
    <div className="col-3">
      <div class="tab">
        {test.map((title, i) => (
          <button
            key={`menuTitle-${i}`}
            class="tablinks"
            onclick={handleButtonClick}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
