import "./weektable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
//import { act } from "react-dom/test-utils";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 1.5 },
    {
      field: "weekday",
      headerName: "Day",
      flex: 3,
      renderCell: (params) => {
        if (params.row.weekday == "MON") return <div>Monday</div>;
        if (params.row.weekday == "TUE") return <div>Tuesday</div>;
        if (params.row.weekday == "WED") return <div>Wednesday</div>;
        if (params.row.weekday == "THU") return <div>Thursday</div>;
        if (params.row.weekday == "FRI") return <div>Friday</div>;
        if (params.row.weekday == "SAT") return <div>Saturday</div>;
        if (params.row.weekday == "SUN") return <div>Sunday</div>;
      },
    },
    {
      field: "start",
      headerName: "Starting time",
      flex: 4,
      renderCell: (params) => {
        const hour = JSON.stringify(params.row.start).slice(0, -2);
        const minute = JSON.stringify(params.row.start).slice(-2);

        return (
          <div>
            {hour}:{minute}
          </div>
        );
      },
    },
    {
      field: "end",
      headerName: "Ending time",
      flex: 4,
      renderCell: (params) => {
        const hour = JSON.stringify(params.row.end).slice(0, -2);
        const minute = JSON.stringify(params.row.end).slice(-2);

        return (
          <div>
            {hour}:{minute}
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 2,
      renderCell: (params) => {
        const buttonClicked = () => {
          fetch("https://styx.rndevelopment.be/api/user_permissions", {
            method: "DELETE",
            body: JSON.stringify({
              weekday: params.row.id,
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
        };
        return (
          <div className="cellAction">
            <Link
              to={`/editweekly/${userId.userId}-${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton"> Edit</div>
            </Link>
            <button
              type="button"
              onClick={buttonClicked}
              className="deleteButton"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  const rows = permissions;
  console.log(permissions);
  return (
    <div>
      <div className="datatable">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={9}
          rowsPerPageOptions={[5]}
        />
      </div>
      <div className="buttonzone">
        <Link
          to={`/addweekly/${userId.userId}`}
          style={{ textDecoration: "none" }}
        >
          <button type="button" className="addButton">
            Add Permission
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Weektable;
