import "./weektable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
//import { act } from "react-dom/test-utils";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DisabledByDefault } from "@mui/icons-material";

const Weektable = () => {
  const userId = useParams();
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
        setPermissions(data);
        console.log(permissions);
      });
  },[]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1.5 },
    { field: "weekday", headerName: "Day", flex: 3,
    renderCell:(params)=> {
      if(params.row.weekday == "MON")return(<div>Monday</div>);
      if(params.row.weekday == "TUE")return(<div>Tuesday</div>);
      if(params.row.weekday == "WED")return(<div>Wednesday</div>);
      if(params.row.weekday == "THU")return(<div>Thursday</div>);
      if(params.row.weekday == "FRI")return(<div>Friday</div>);
      if(params.row.weekday == "SAT")return(<div>Saturday</div>);
      if(params.row.weekday == "SUN")return(<div>Sunday</div>);

    }},
    { field: "start", headerName: "Starting time", flex: 4 ,
  renderCell:(params)=> {
    const hour = (JSON.stringify(params.row.start)).slice(0,-2)
    const minute = (JSON.stringify(params.row.start)).slice(-2)
    
    return(
      <div>
       {hour }:{minute}
      </div>

    );
  }},
    { field: "end", headerName: "Ending time", flex: 4,
    renderCell:(params)=> {
      const hour = (JSON.stringify(params.row.end)).slice(0,-2)
      const minute = (JSON.stringify(params.row.end)).slice(-2)
      
      return(
        <div>
         {hour }:{minute}
        </div>
  
      );
    } },
    {
      field: "edit",
      headerName: "Edit",
      flex: 2,
      renderCell: (params) => {
        const buttonClicked = () => {
          fetch("https://styx.rndevelopment.be/api/user_permissions", {
            method: "DELETE",
            body: JSON.stringify({
              id: params.row.id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
          window.location.reload(true);
        };
        return (
          <div className="cellAction">
            <Link
              to={`/editweekly/${userId.userId}-${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton"> Edit</div>
            </Link>
            <button onClick={buttonClicked} className="deleteButton">
              Delete
            </button>
          </div>
        );
      },
    },
  ];
/*const allowances = permissions
console.log(allowances)
for (let i =0;i <allowances.length;i++){
  const hour = JSON.stringify(allowances[i].start).slice(0,-2)
  const minute = JSON.stringify(allowances[i].start).slice(-2)
  console.log(hour + ":" + minute)
  allowances[i].start = hour + ":" + minute
  console.log(allowances)
}

*/
console.log(permissions)

  const rows = permissions;

  return (
    <div className="datatable">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[5]}
      />
      <div className="buttonzone">
        <Link
          to={`/addweekly/${userId.userId}`}
          style={{ textDecoration: "none" }}
        >
          <div>Add Permission</div>
        </Link>
      </div>
    </div>
  );
};

export default Weektable;
