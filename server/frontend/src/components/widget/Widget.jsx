import React from "react";
import "./widget.scss";

import { Link } from "react-router-dom";

const Widget = () => {
  let data;

  const amount = 100;
  const diff = 20;

  data = {
    title: "Employees in building",
    link: "See all employees",
  };

  return (
    <div className="widget">
      <span className="title">{data.title}</span>
      <span className="counter">{amount}</span>
      <Link to="/users" style={{ textDecoration: "none" }}>
        <span className="link">{data.link}</span>
      </Link>
    </div>
  );
};

export default Widget;
