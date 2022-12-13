import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import { createJWT, url } from "../../App";

const Featured = () => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };
    fetch("${url}/api/entries", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInfo(data);
      });
  }, []);

  const Total_employees = info.total;
  const Employees_in = info.inside;
  const percentage = (100 * Employees_in) / Total_employees;
  console.log(Total_employees);
  console.log(Employees_in);
  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Attendance rate</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={percentage}
            text={Employees_in === 0 ? "0" : Employees_in}
            strokeWidth={5}
          />
        </div>
      </div>
      <div className="totalpercentage">/{Total_employees}</div>
    </div>
  );
};

export default Featured;
