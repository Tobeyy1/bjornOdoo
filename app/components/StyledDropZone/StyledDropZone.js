"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import classes from "./StyledDropZone.module.scss";

const baseStyle = {
  flex: 1,
  display: "grid",
  placeContent: "center",
  // textAlign: "center",
  padding: "20px",
  borderWidth: 2,
  borderColor: "var(--text100)",
  borderStyle: "dashed",
  borderRadius: "6px",
  backgroundColor: "transparent",
  color: "var(--text100)",
  height: "100%",
  outline: "none",
  cursor: "pointer",
  transition: "all .24s ease-in-out",
};

const focusedStyle = {
  color: "#56bdf5",
  borderColor: "#56bdf5",
};

const acceptStyle = {
  color: "#50d3b4",
  borderColor: "#50d3b4",
};

const rejectStyle = {
  color: "#b61515",
  borderColor: "#b61515",
};

const StyledDropZone = ({ onImageDrop }) => {
  const [disabledInput, setDisabledInput] = useState(false);
  const fileRef = useRef();
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "text/plain": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-powerpoint": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [],
    },
    disabled: disabledInput ? true : false,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setDisabledInput(true);
      const formData = new FormData();
      formData.set("file", acceptedFiles[0]);
      onImageDrop(formData);
      return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        console.log("BASE64 Representation: ", base64);
        // Call the function to handle the Base64 data
        onImageDrop(base64);
      };
      reader.readAsDataURL(acceptedFiles[0]); // Convert the file to Base64
    }
  }, [disabledInput, acceptedFiles, onImageDrop]);

  const files = acceptedFiles.map((file) => {
    return (
      <li key={file.path} className={classes.accepted__file}>
        <div className={classes.file__path}>
          <span className="material-symbols-rounded">description</span>
          <p>{file.path}</p>
        </div>
        <p className={classes.file__size}>{file.size} bytes</p>
      </li>
    );
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className={classes.container}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag and drop your invoice here, or click to select files</p>
        <em>(Only *.pdf files will be accepted)</em>
      </div>
    </div>
  );
};

export default StyledDropZone;
