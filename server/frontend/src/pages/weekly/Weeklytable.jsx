import Weektable from "../../components/scheduler/Weektable";
import "./weeklytable.scss"


const Weeklytable= () => {
  return (
    <div className="weeklytable">
      <p className="title">Allowance periods of ...</p>
      <Weektable/>
      
    </div>
  );
};

export default Weeklytable;