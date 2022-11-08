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
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch("https://styx.rndevelopment.be/api/users", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      });
  }, []);

  const rows = posts;

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
            <TableCell className="tableCell">Group</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell className="tableCell">{row.firstName}</TableCell>
              <TableCell className="tableCell">{row.lastName}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.timestamp}</TableCell>
              <TableCell className="tableCell">{row.group}</TableCell>
              <TableCell className="tableCell"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
