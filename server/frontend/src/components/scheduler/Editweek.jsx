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
  const [hour, setHour] = useState([]);
  const [minute, setMinute] = useState([]);
  const minutes = [];
  for (let i = 0; i < 61; i++) {
    minutes.push(i);
  }
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
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
          <h1>Edit Timeperiod (id:{permissionId})</h1>
        </div>
        <div className="bottom">
          <form>
            <div className="day">
              <label>Day</label>
              <DropdownList
                data={days}
                value={day}
                onChange={(day) => setDay(day)}
              />
            </div>

            <div className="right">
              <div className="roller">
                <label>Start</label>
                <DropdownList
                  data={hours}
                  value={hour}
                  onChange={(hour) => setHour(hour)}
                />
                <DropdownList
                  data={minutes}
                  value={minute}
                  onChange={(minute) => setMinute(minute)}
                />
              </div>

              <div className="roller">
                <label>End</label>
                <DropdownList
                  data={hours}
                  value={hour}
                  onChange={(hour) => setHour(hour)}
                />
                <DropdownList
                  data={minutes}
                  value={minute}
                  onChange={(minute) => setMinute(minute)}
                />
              </div>
              <button>Action</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
