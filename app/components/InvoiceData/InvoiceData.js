import React from "react";
import classes from "./InvoiceData.module.scss";

const InvoiceData = ({ data }) => {
  const dataKeysArray = Object.keys(data);
  // console.log(data[dataKeysArray[0]].selected_value.content);

  return (
    <div className={classes.container}>
      <header>
        <h1>Invoice Data</h1>
      </header>

      <section className={classes.dataContainer}>
        {dataKeysArray.map((key, index) => {
          if (!data[key].selected_value?.content) return;
          return (
            <div className={classes.data} key={index}>
              <p className={classes.key}>{key} :</p>{" "}
              <p className={classes.value}>
                {data[key].selected_value?.content
                  ? data[key].selected_value.content
                  : "N/A"}
              </p>
            </div>
          );
        })}
      </section>
      <button type="button">Confirm</button>
    </div>
  );
};

export default InvoiceData;
