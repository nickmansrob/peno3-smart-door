import "./editweek.scss";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
const Edit = () => {
  const id = useParams();
  const idArray = id.userId.split("-");

  const userId = Number(idArray[0]);
  const permissionId = Number(idArray[1]);
  const [permissions, setPermissions] = useState([]);
  const starttimeprev = permissions.find((x) => x.id === permissionId)
    ? permissions.find((x) => x.id === permissionId).start
    : "1600";
  const endtimeprev = permissions.find((x) => x.id === permissionId)
    ? permissions.find((x) => x.id === permissionId).end
    : "1600";
  const starthourprev = JSON.stringify(starttimeprev).slice(0, -2);
  const startminuteprev = JSON.stringify(starttimeprev).slice(-2);

  const endhourprev = JSON.stringify(endtimeprev).slice(0, -2);
  const endminuteprev = JSON.stringify(endtimeprev).slice(-2);
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
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];

  const buttonPressed = () => {
    const payloadstarthour =
      starthour === 0 ? Number(starthourprev) : starthour;
    const payloadstartminute =
      startminute === 0 ? Number(startminuteprev) : startminute;
    const payloadendhour = endhour === 0 ? Number(endhourprev) : endhour;
    const payloadendminute =
      endminute === 0 ? Number(endminuteprev) : endminute;

    console.log(payloadstarthour);

    const bodydata = {
      id: Number(userId),
      s: payloadstarthour * 100 + payloadstartminute,
      e: payloadendhour * 100 + payloadendminute,
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
                    placeholder={starthourprev}
                    onChange={(starthour) => setStarthour(starthour)}
                  />
                  <DropdownList
                    className="dropdown"
                    data={minutes}
                    value={startminute}
                    placeholder={startminuteprev}
                    onChange={(startminute) => setStartminute(startminute)}
                  />
                </div>
              </div>

              <div className="roller">
                <label>End</label>
                <div className="ddcontainer">
                  <DropdownList
                    className="dropdown"
                    data={
                      starthour === 0
                        ? hours.filter((hour) => hour >= starthourprev)
                        : hours.filter((hour) => hour >= starthour)
                    }
                    value={endhour}
                    placeholder={endhourprev}
                    onChange={(endhour) => setEndhour(endhour)}
                  />
                  <DropdownList
                    className="dropdown"
                    data={
                      endhour === starthour
                        ? minutes.filter(
                            (minute) =>
                              minute >
                              (startminute === 0
                                ? Number(startminuteprev)
                                : startminute)
                          )
                        : minutes
                    }
                    value={endminute}
                    placeholder={endminuteprev}
                    onChange={(endminute) => setEndminute(endminute)}
                  />
                </div>
              </div>
              <Link
                to={`/weeklytable/${userId}`}
                style={{ textDecoration: "none" }}
              >
                <button
                  className="addbutton"
                  type="button"
                  onClick={buttonPressed}
                >
                  Edit
                </button>
              </Link>
            </div>
          </form>
        </div>
        <Link to={`/weeklytable/${userId}`} style={{ textDecoration: "none" }}>
          <div className="link">All permissions</div>
        </Link>
      </div>
    </div>
  );
};

export default Edit;
