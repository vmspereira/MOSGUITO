import {Checkbox} from '@material-ui/core'
import React, {useState} from "react";

const LabelledCheckbox = ({ label, checked, setChecked, helpMessage ="" }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return <div className="container">
    <div className="left">
      <span>{label}</span>
    </div>
    <div className="right" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <Checkbox
        checked={checked}
        onChange={setChecked}
      />
    </div>
    <div style={{ height:"40px"}}>
    {isHovering && <div className="alert alert-info">{helpMessage}</div>}
    </div>
  </div>
}

export default LabelledCheckbox