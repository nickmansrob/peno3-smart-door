import "./editweek.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { isDOMComponent } from "react-dom/test-utils";
const Edit = () => {
  const id = useParams();
  const idArray = id.userId.split("-");

  const userId = idArray[0];
  const permissionId = idArray[1];
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };

    fetch(`https://styx.rndevelopment.be/api/user_permissions/?id=${userId.userId}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setPermissions(data);
        console.log(permissions)
      });
  });

  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [day, setDay] = useState([]);
  const [starthour, setStarthour] = useState([]);
  const [endhour, setEndhour] = useState([]);
  const [startminute, setStartminute] = useState([]);
  const [endminute, setEndminute] = useState([]);
  const minutes = [];
  for (let i = 0; i < 61; i++) {
    minutes.push(i);
  }
  const days = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];


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
                placeholder="MON"
                value={day}
                onChange={(day) => setDay(day)}
              />
            </div>

            <div className="right">
              <div className="roller">
                <label>Start</label>
                <DropdownList
                
                  data={hours}
                  value={starthour}
                  defaultValue="1"
                  onChange={(starthour) => setStarthour(starthour)}
                />
                <DropdownList
                  data={minutes}
                  value={startminute}
                  onChange={(startminute) => setStartminute(startminute)}
                />
              </div>

              <div className="roller">
                <label>End</label>
                <DropdownList
                
                  data={hours}
                  value={endhour}
                  onChange={(endhour) => setEndhour(endhour)}
                />
                <DropdownList
                  data={minutes}
                  value={endminute}
                  onChange={(endminute) => setEndminute(endminute)}
                />
              </div>
              <button>Edit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
