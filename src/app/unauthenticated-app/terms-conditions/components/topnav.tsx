import React from "react";
import { Link } from "react-router-dom";

export const TopNav = () => {
  return (
    <ul className="top_nav">
      <li className="item">
        <Link to="/login">Log in</Link>
      </li>
    </ul>
  );
};
