import "./addweek.scss";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import "react-widgets/styles.css";
import { useParams, Link } from "react-router-dom";
// import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { createJWT, url } from "../../App";

const Addweek = () => {
  const [day, setDay] = useState("");
  const [starthour, setStarthour] = useState(0);
  const [startminute, setStartminute] = useState(0);
  const [endhour, setEndhour] = useState(0);
  const [endminute, setEndminute] = useState(0);
  const [permissions, setPermissions] = useState([]);

  const minutes = [];
  for (let i = 0; i < 61; i++) {
    minutes.push(i);
  }
  const permissiondays = permissions.map((a) => a.weekday);
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const days = weekdays.filter((n) => !permissiondays.includes(n));
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];

  const id = useParams();
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };

    fetch(
      `${url}/api/user_permissions/?id=${id.userId}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPermissions(data);
      });
  }, []);
  const buttonPressed = () => {
    const bodydata = {
      id: Number(id.userId),
      s: starthour * 100 + startminute,
      e: endhour * 100 + endminute,
      weekday: day,
    };
    console.log(bodydata);
    fetch("${url}/api/user_permissions", {
      method: "POST",
      body: JSON.stringify(bodydata),
      headers: {
        Authorization: createJWT(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((bodydata) => {
        console.log(bodydata);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Permission</h1>
        </div>
        <div className="bottom">
          <form className="weekform">
            <div className="right">
              <div className="roller">
                <label>Day </label>
                <div className="ddcontainer">
                  <DropdownList
                    className="dropdown"
                    data={days}
                    value={day}
                    onChange={(day) => setDay(day)}
                  />
                </div>
              </div>
              <div className="roller">
                <label>Start </label>
                <div className="ddcontainer">
                  <DropdownList
                    className="dropdown"
                    data={hours}
                    value={starthour}
                    onChange={(starthour) => setStarthour(starthour)}
                  />
                  <DropdownList
                    className="dropdown"
                    data={minutes}
                    value={startminute}
                    onChange={(minute) => setStartminute(minute)}
                  />
                </div>
              </div>

              <div className="roller">
                <label>End </label>
                <div className="ddcontainer">
                  <DropdownList
                    className="dropdown"
                    data={hours.filter((hour) => hour >= starthour)}
                    value={endhour}
                    onChange={(endhour) => setEndhour(endhour)}
                  />
                  <DropdownList
                    className="dropdown"
                    data={
                      endhour === starthour
                        ? minutes.filter((minute) => minute > startminute)
                        : minutes
                    }
                    value={endminute}
                    onChange={(endminute) => setEndminute(endminute)}
                  />
                </div>
              </div>

              <Link to={`/weeklytable/${id.userId}`}>
                <button
                  className="addbutton"
                  type="button"
                  onClick={buttonPressed}
                >
                  Add
                </button>
              </Link>
            </div>
          </form>
        </div>

        <Link
          to={`/weeklytable/${id.userId}`}
          style={{ textDecoration: "none" }}
        >
          <div className="link">All permissions</div>
        </Link>
      </div>
    </div>
  );
};

export default Addweek;
