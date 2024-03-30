import React from "react";
import InvoiceUploader from "./InvoiceUploader/InvoiceUploader";
import classes from "./page.module.scss";

const page = () => {
  return (
    <div className={classes.container}>
      <InvoiceUploader />
    </div>
  );
};

export default page;
