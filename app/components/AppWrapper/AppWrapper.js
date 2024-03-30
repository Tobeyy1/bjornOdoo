import React from "react";
import classes from "./AppWrapper.module.scss";
import NavBar from "../NavBar/NavBar";
import Header from "../Header/Header";

const AppWrapper = ({ children }) => {
  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.body}>
        <NavBar />
        <div className={classes.children__container}>{children}</div>
      </div>
    </div>
  );
};

export default AppWrapper;
