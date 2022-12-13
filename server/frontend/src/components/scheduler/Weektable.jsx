import "./weektable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { createJWT, url } from "../../App";

const Weektable = () => {
  const userId = useParams();
  const [permissions, setPermissions] = useState([]);
  const weekdayarray = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };

    fetch(
      `${url}/api/user_permissions/?id=${userId.userId}`,
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
      sortingOrder: ["desc", "asc"],

      renderCell: (params) => {
        switch (params.row.weekday) {
          case "MON":
            return <div>Monday</div>;
          case "TUE":
            return <div>Tuesday</div>;
          case "WED":
            return <div>Wednesday</div>;
          case "THU":
            return <div>Thursday</div>;
          case "FRI":
            return <div>Friday</div>;
          case "SAT":
            return <div>Saturday</div>;
          default:
            return <div>Sunday</div>;
        }

        // if (params.row.weekday === "MON") return <div>Monday</div>;
        // if (params.row.weekday === "TUE") return <div>Tuesday</div>;
        // if (params.row.weekday === "WED") return <div>Wednesday</div>;
        // if (params.row.weekday === "THU") return <div>Thursday</div>;
        // if (params.row.weekday === "FRI") return <div>Friday</div>;
        // if (params.row.weekday === "SAT") return <div>Saturday</div>;
        // if (params.row.weekday === "SUN") return <div>Sunday</div>;
      },
      sortComparator: (v1, v2) =>
        weekdayarray.indexOf(v1) - weekdayarray.indexOf(v2),
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
      headerName: "Actions",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const buttonClicked = () => {
          fetch(`${url}/api/user_permissions`, {
            method: "DELETE",
            body: JSON.stringify({
              weekday: params.row.weekday,
              id: Number(userId.userId),
            }),
            headers: {
              Authorization: createJWT(),
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
          initialState={{
            sorting: {
              sortModel: [{ field: "weekday", sort: "asc" }],
            },
          }}
          rows={rows}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
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
