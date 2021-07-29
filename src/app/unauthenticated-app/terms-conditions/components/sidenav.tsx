import React from "react";
import Logo from "../../../components/Logo";
import { SideNavProps } from "../types";
import { Link } from "react-router-dom";

export const SideNav = (props: SideNavProps<object>) => {
  const { links, setActivePage } = props;
  return (
    <div id="sidenav">
      <div>
        <div className="heading">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <ul className="nav_list">
          {links.map((i) => (
            <li
              key={i.key}
              className="item"
              onClick={() => setActivePage(i.key)}
            >
              {i.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="footer">
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};
