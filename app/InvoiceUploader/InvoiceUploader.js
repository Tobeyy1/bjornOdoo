"use client";
import React, { useEffect, useState } from "react";
import classes from "./InvoiceUploader.module.scss";
import StyledDropZone from "../components/StyledDropZone/StyledDropZone";
import InvoiceData from "../components/InvoiceData/InvoiceData";
import { DUMMY_DATA } from "../utils/utils";

const InvoiceUploader = () => {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [imageURI, setImageURI] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [documentToken, setDocumentToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageDropHandler = (imageURI) => {
    setImageURI(imageURI);
    console.log("imageURI" + imageURI);
    sendInvoiceToAPI(imageURI);
    // console.log(DUMMY_DATA[0]);
    // setInvoiceData(DUMMY_DATA[0]);
  };

  function onDocumentLoadSuccess(numPages) {
    setNumPages(numPages);
  }

  const sendInvoiceToAPI = async (formData) => {
    setIsLoading(true);
    const response = await fetch("/api/sendInvoice", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data.result);
    if (data.success === true) {
      setInvoiceData(data.result[0]);
    } else {
      console.log(data.message);
    }
    setIsLoading(false);
  };

  if (isLoading) return <h1 className={classes.loading}>Fetching Data...</h1>;

  return (
    <div className={classes.container}>
      {imageURI ? (
        <InvoiceData data={invoiceData} />
      ) : (
        <StyledDropZone onImageDrop={imageDropHandler} />
      )}
    </div>
  );
};

export default InvoiceUploader;
