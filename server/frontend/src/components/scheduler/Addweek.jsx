import "./addweek.scss";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
const Addweek = () => {
  const [day, setDay] = useState("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hourE, setHourE] = useState(0);
  const [minuteE, setMinuteE] = useState(0);
  const minutes = [];
  for (let i = 0; i < 61; i++) {
    minutes.push(i);
  }
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];
  const id = useParams();
  const buttonPressed = () => {
    const bodydata = {
      id: Number(id.userId),
      s: hour * 100 + minute,
      e: hourE * 100 + minuteE,
      weekday: day,
    };
    console.log(bodydata);
    fetch("https://styx.rndevelopment.be/api/user_permissions", {
      method: "POST",
      body: JSON.stringify(bodydata),
      headers: {
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
          <h1>Add Permission</h1>
        </div>
        <div className="bottom">
          <form>
            <div className="right">
              <div className="roller">
                <label>Day</label>
                <DropdownList
                  data={days}
                  value={day}
                  onChange={(day) => setDay(day)}
                />
              </div>
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
                  value={hourE}
                  onChange={(hourE) => setHourE(hourE)}
                />
                <DropdownList
                  data={minutes}
                  value={minuteE}
                  onChange={(minuteE) => setMinuteE(minuteE)}
                />
              </div>
              <button type="button" onClick={buttonPressed}>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addweek;
