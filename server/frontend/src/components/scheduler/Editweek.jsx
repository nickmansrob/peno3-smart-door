import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
const Edit = () => {
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [day, setDay] = useState([]);
  const days = ["Monday","Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"];
  const id = useParams();
  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(
      `https://styx.rndevelopment.be/api/users/?id=${id.userId}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      });

    fetch(`https://styx.rndevelopment.be/api/roles`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRoles(data);
      });
  }, []);

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit Timeperiod(id:{id.userId})</h1>
        </div>
        <div className="bottom">
        <div className="day">
                <label>Day</label>
                <DropdownList
                  data={days}
                  value={day}
                  onChange={(day) => setDay(day)}
                />
              </div>
          
          <div className="right">
            <form>
              <div className="formInput">
                <label>Begin timeperiod</label>
                <input type="text" placeholder={user.firstName} />
              </div>
              
              <div className="formInput">
                <label>End Timeperiod</label>
                <input type="text" placeholder={user.lastName} />
              </div>
              <button>Edit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
