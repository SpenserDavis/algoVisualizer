import React from "react";

const speeds = {
  Slow: 200,
  Medium: 100,
  Fast: 50,
};

const SiteHeader = ({ speed, handleSpeedChangeRequest }) => {
  const onSpeedChangeRequest = (e) => {
    const { value } = e.target;
    handleSpeedChangeRequest(parseInt(value));
  };

  const renderRadioButtons = () =>
    Object.keys(speeds).map((s, i) => (
      <div key={`speed-${i}`} className="form-check speed-button float-right">
        <input
          className="form-check-input"
          type="radio"
          name={s}
          value={speeds[s]}
          checked={speed === speeds[s]}
          onChange={onSpeedChangeRequest}
        />
        <label className="form-check-label" htmlFor={s}>
          {s}
        </label>
      </div>
    ));

  return (
    <>
      <div className="row pageHeader">
        <h2>Algorithm Visualizer</h2>
      </div>
      {renderRadioButtons()}
    </>
  );
};

export default SiteHeader;
