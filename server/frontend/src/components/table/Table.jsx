import "./table.scss";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useEffect } from "react";

const List = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(
      "https://styx.rndevelopment.be/api/latest_entries/?amount=5",
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        data.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        console.log(data);
        setUsers(data);
      });

    fetch("https://styx.rndevelopment.be/api/roles", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRoles(data);
      });
  }, []);

  const rows = users;
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Employee Id</TableCell>
            <TableCell className="tableCell">Name</TableCell>
            <TableCell className="tableCell">Surname</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Timestamp</TableCell>
            <TableCell className="tableCell">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell className="tableCell">{row.firstName}</TableCell>
              <TableCell className="tableCell">{row.lastName}</TableCell>
              <TableCell className="tableCell">
                {row.timestamp.slice(0, 10)}
              </TableCell>
              <TableCell className="tableCell">
                {row.timestamp.slice(11, -5)}
              </TableCell>
              <TableCell className="tableCell">
                {roles.find((x) => x.id === row.role).name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
