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
    { field: "weekday", headerName: "Day", flex: 3 },
    { field: "start", headerName: "Starting time", flex: 4 },
    { field: "end", headerName: "Ending time", flex: 4 },
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

 /* for (let i < permissions.length; i++){
    permissions[i].start= permissions[i].start[-3,-1]
  }
*/
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
