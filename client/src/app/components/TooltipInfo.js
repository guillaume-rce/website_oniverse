import React, { useState } from 'react';
import './TooltipInfo.css';

const TooltipInfo = ({ children, text, position }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => {
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div className={`tooltip-box tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default TooltipInfo;
