import Weektable from "../../components/scheduler/Weektable";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./weeklytable.scss"


const Weeklytable= () => {
  return (
    <div className="weeklytable">
     <Sidebar/>
     <div className="weektableContainer">
      <Navbar/>
      <div>
      <Weektable/>
      </div>
      </div>
    </div>
  );
};

export default Weeklytable;