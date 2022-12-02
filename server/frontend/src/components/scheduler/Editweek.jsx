import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { isDOMComponent } from "react-dom/test-utils";
const Edit = () => {
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [day, setDay] = useState([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const id = useParams();
  const idArray = id.userId.split("-");

  const userId = idArray[0];
  const permissionId = idArray[1];

  // useEffect(() => {
  //   const requestOptions = {
  //     method: "GET",
  //   };
  //   fetch(
  //     `https://styx.rndevelopment.be/api/users/?id=${userId}`,
  //     requestOptions
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setUser(data);
  //     });

  //   fetch(`https://styx.rndevelopment.be/api/roles`, requestOptions)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setRoles(data);
  //     });
  // }, []);

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit Timeperiod(id:{permissionId})</h1>
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
                <input type="text" />
              </div>

              <div className="formInput">
                <label>End Timeperiod</label>
                <input type="text" />
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
