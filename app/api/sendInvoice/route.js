import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import multer from "multer";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

const docPath = "/Users/Yoga/Desktop/Udemy JavaScript Certificate.jpg";

const accountToken = "integration_token"; // Use your token
const domainName = "https://extract.api.odoo.com";
const docType = "invoice"; // invoice, expense, or applicant

// Do not change
const API_VERSION = {
  invoice: 122,
  expense: 132,
  applicant: 102,
};

async function getResultFromExtract(documentToken) {
  const params = {
    version: API_VERSION[docType],
    document_token: documentToken,
    account_token: accountToken,
  };
  const endpoint = `/api/extract/${docType}/2/get_result`;
  let response = await extractJsonRpcCall(endpoint, params);
  while (response.result.status === "processing") {
    console.log("Still processing... Retrying in 5 seconds");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    response = await extractJsonRpcCall(endpoint, params);
  }
  return response;
}

const extractJsonRpcCall = async (path, params) => {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: params,
    id: 0, // This should be unique for each call
  };
  const response = await fetch(domainName + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

export async function POST(req, res) {
  try {
    console.log("API active");

    const fileData = await req.formData();
    const file = fileData.get("file");

    if (!file) {
      return NextResponse.json({
        success: false,
      });
    }
    // Convert the file data to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert the ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Encode the Buffer to Base64
    const encodedFileData = buffer.toString("base64");
    const base64String = encodedFileData;

    const params = {
      account_token: accountToken,
      version: API_VERSION[docType], // Assuming you're working with invoices
      documents: [base64String],
      // Add any other required parameters
    };
    const parsePath = `/api/extract/${docType}/2/parse`;

    // console.log(odooResponse);
    const data = await extractJsonRpcCall(parsePath, params);
    if (!data.result && !data.result.document_token) return;
    console.log(data.result.document_token);
    const documentToken = data.result.document_token;
    const getResultResponse = await getResultFromExtract(documentToken);
    console.log("Final Response: ", getResultResponse.result.results);

    return NextResponse.json({
      status: 200,
      message: "success",
      success: true,
      result: getResultResponse.result.results,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "Something went wrong: " + error.message,

      success: false,
    });
  }
}
