const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const accountToken = "integration_token"; // Use your token
const domainName = "https://extract.api.odoo.com";
const pathToPdf = "/path/to/your/pdf"; // Replace with the path to your PDF file
const docType = "invoice"; // invoice, expense, or applicant

// Do not change
const API_VERSION = {
  invoice: 122,
  expense: 132,
  applicant: 102,
};

async function extractJsonRpcCall(path, params) {
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
}

async function sendDocumentToExtract(docPath) {
  const fileData = fs.readFileSync(docPath);
  const encodedDoc = Buffer.from(fileData).toString("base64");
  const params = {
    account_token: accountToken,
    version: API_VERSION[docType],
    documents: [encodedDoc],
  };
  const response = await extractJsonRpcCall(
    `/api/extract/${docType}/2/parse`,
    params
  );
  return response;
}

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

(async () => {
  try {
    // Parse the document
    const parseResponse = await sendDocumentToExtract(pathToPdf);
    console.log("/parse call status:", parseResponse.result.status_msg);

    if (parseResponse.result.status !== "success") {
      process.exit(1);
    }

    const documentToken = parseResponse.result.document_token;

    // Get the results of the parsing
    const getResultResponse = await getResultFromExtract(documentToken);

    // Write the response to a file
    const outputFilePath = path.join(__dirname, "response.json");
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(getResultResponse, null, 2)
    );
    console.log("\nResult saved in", outputFilePath);

    console.log(
      "/get_results call status:",
      getResultResponse.result.status_msg
    );
    if (getResultResponse.result.status !== "success") {
      process.exit(1);
    }

    const documentResults = getResultResponse.result.results[0];

    console.log("\nTotal:", documentResults.total.selected_value.content);
    console.log("Subtotal:", documentResults.subtotal.selected_value.content);
    console.log(
      "Invoice id:",
      documentResults.invoice_id.selected_value.content
    );
    console.log("Date:", documentResults.date.selected_value.content);
    console.log("...");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();
