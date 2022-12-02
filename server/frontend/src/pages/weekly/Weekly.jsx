import Week from "../../components/scheduler/Week";
import { Link, useParams } from "react-router-dom";
import "./weekly.scss";
import { CleaningServices } from "@mui/icons-material";


const Weekly= () => {
  const id= useParams()
 console.log(id)
  return (
    <div className="weekly">
      <Link
                to={`/weeklytable/${id.userId}`}
                style={{ textDecoration: "none" }}
              >
                <div className="viewButton"> See table</div>
              </Link>
      <Week/>

      
    </div>
  );
};

export default Weekly;