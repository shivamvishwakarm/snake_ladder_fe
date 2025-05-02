import React from "react";

const Ladder = () => {
  return (
    <div>
      <svg
        width="130px"
        height="190px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Stylized lines forming a pattern">
        <defs>
          <style>
            {`.cls-1 {
                fill: none;
                stroke: #020202;
                stroke-miterlimit: 10;
                stroke-width: 1.92px;
              }`}
          </style>
        </defs>
        <line className="cls-1" x1="12" y1="0.5" x2="2.42" y2="23.5" />
        <line className="cls-1" x1="21.58" y1="0.5" x2="12" y2="23.5" />
        <line className="cls-1" x1="10.08" y1="4.33" x2="19.67" y2="4.33" />
        <line className="cls-1" x1="8.17" y1="9.13" x2="17.75" y2="9.13" />
        <line className="cls-1" x1="6.25" y1="13.92" x2="15.83" y2="13.92" />
        <line className="cls-1" x1="4.33" y1="18.71" x2="13.92" y2="18.71" />
      </svg>
    </div>
  );
};

export default Ladder;
