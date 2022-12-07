import "./editweek.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
const Edit = () => {
  const id = useParams();
  const idArray = id.userId.split("-");

  const userId = Number(idArray[0]);
  const permissionId = Number(idArray[1]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };

    fetch(
      `https://styx.rndevelopment.be/api/user_permissions/?id=${userId.userId}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.find((x) => x.id === permissionId));
        setPermissions(data);
      });
  }, []);

  const [starthour, setStarthour] = useState(0);
  const [endhour, setEndhour] = useState(0);
  const [startminute, setStartminute] = useState(0);
  const [endminute, setEndminute] = useState(0);
  const minutes = [];
  for (let i = 0; i < 61; i++) {
    minutes.push(i);
  }
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];

  const buttonPressed = () => {
    const bodydata = {
      id: Number(userId),
      s: starthour * 100 + startminute,
      e: endhour * 100 + endminute,
      weekday: permissions.find((x) => x.id === permissionId).weekday,
    };
    fetch(`https://styx.rndevelopment.be/api/user_permissions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodydata),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    setEndhour(0);
    setEndminute(0);
    setStarthour(0);
    setStartminute(0);
  };

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
      <div className="newContainer">
        <div className="top">
          <h1>Edit Timeperiod (id:{permissionId})</h1>
        </div>
        <div className="bottom">
          <form className="weekform">
            <div className="right">
              <div className="daycontainer">
                {permissions.find((x) => x.id === permissionId)
                  ? permissions.find((x) => x.id === permissionId).weekday
                  : ""}
              </div>

              <div className="roller">
                <label>Start</label>
                <div className="ddcontainer">
                  <DropdownList
                    className="dropdown"
                    data={hours}
                    value={starthour}
                    defaultValue="1"
                    onChange={(starthour) => setStarthour(starthour)}
                  />
                  <DropdownList
                    className="dropdown"
                    data={minutes}
                    value={startminute}
                    onChange={(startminute) => setStartminute(startminute)}
                  />
                </div>
              </div>

              <div className="roller">
                <label>End</label>
                <div className="ddcontainer">
                  <DropdownList
                    className="dropdown"
                    data={hours}
                    value={endhour}
                    onChange={(endhour) => setEndhour(endhour)}
                  />
                  <DropdownList
                    className="dropdown"
                    data={minutes}
                    value={endminute}
                    onChange={(endminute) => setEndminute(endminute)}
                  />
                </div>
              </div>
              <button
                className="addbutton"
                type="button"
                onClick={buttonPressed}
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
