import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  const Total_employees =70
  const Employees_in = 49
  const percentage = 100 * Employees_in / Total_employees
  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Attendance rate</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={percentage} text={Employees_in} strokeWidth={5} />
        </div>
      </div>
    </div>
  );
};

export default Featured;
