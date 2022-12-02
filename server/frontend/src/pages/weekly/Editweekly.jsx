import Editweek from "../../components/scheduler/Editweek";
import "./editweekly.scss"
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";


const Editweekly= () => {
  return (

    <div className="editweekly">
      <Sidebar/>
      <div className="editContainer">
        <Navbar/>
        <Editweek/>
      </div>

      
     
      
    </div>
  );
};

export default Editweekly;