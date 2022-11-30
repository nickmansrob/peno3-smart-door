import "./weektable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
//import { act } from "react-dom/test-utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DisabledByDefault } from "@mui/icons-material";


const Weektable = () => {
  
  const [allowances, setAllowances] = useState([]);
 

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };

    fetch("https://styx.rndevelopment.be/api/user_restrictions", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setAllowances(data);
      });})

   

 

  const columns = [
    { field: "id", headerName: "ID",flex:1.5},
    { field: "day", headerName: "Day", flex:3},
    { field: "start", headerName: "Starting time", flex:4},
    { field: "end", headerName: "Ending time", flex:4 },
    {field: "edit",headerName: "Edit",flex:2,
        renderCell: (params) => {
          const buttonClicked = () =>{
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
          window.location.reload(true);}
          return (
            <div className="cellAction">
              <Link
                to={`/editweekly/${params.row.id}`}
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
      },]
    

  const rows = [{id:1, day: "Monday",start:"17h30", end:"19h30" },
  {id:2, day: "Tuesday",start:"17h30", end:"19h30" },
  {id:3, day: "Wednesday",start:"13h00", end:"14h00" },
  {id:4, day: "Monday",start:"12h30", end:"20h30" }];

  return (
    <div className="datatable">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[5]}
        
      />
    </div>
  );
};

export default Weektable;