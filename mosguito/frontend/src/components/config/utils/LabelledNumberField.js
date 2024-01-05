import {TextField} from "@material-ui/core";
import {useState} from "react";

const LabelledNumberField = ({ label, value, onChange, minimum=1, step=1, helpMessage ="" }) => {
  const inputProps = {
    min: minimum,
    step: step,
  };

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
      <TextField
        type='number'
        fullWidth
        value={value}
        onChange={onChange}
        inputProps={inputProps}
      />
    </div>
    {helpMessage &&
    <div style={{ height:"60px"}}>
    {isHovering && <div className="alert alert-info">{helpMessage}</div>}
    </div>
    }
  </div>
}

export default LabelledNumberField