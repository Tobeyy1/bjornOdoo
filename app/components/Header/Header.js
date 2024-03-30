import React from "react";
import classes from "./Header.module.scss";
import { CiMenuFries } from "react-icons/ci";

const Header = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left__container}>
        <button className={classes.menu__toggler}>
          <CiMenuFries />
        </button>
        <div className={classes.company__name__and__logo}>
          <span className={classes.company__logo}>B</span>
          <span className={classes.company__name}>Bjorn Odoo</span>
        </div>
      </div>
      <div className={classes.right__container}>
        <span>Bjorn</span>
        <span>Administrator</span>
      </div>
    </div>
  );
};

export default Header;
