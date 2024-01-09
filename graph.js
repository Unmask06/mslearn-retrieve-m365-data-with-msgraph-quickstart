//graph.js
// Create an authentication provider
const authProvider = {
  getAccessToken: async () => {
    // Call getToken in auth.js
    return await getToken();
  },
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
async function getUser() {
  ensureScope("user.read");
  return await graphClient.api("/me").select("id,displayName").get();
}

/*async function sendAccessToken() {
  const accessToken = await authProvider.getAccessToken();
  const apiUrl = "http://localhost:8000/receive_token"; // URL of your FastAPI endpoint

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: accessToken }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}*/

async function createExcelBlobFile() {
  ensureScope("Files.ReadWrite");
  let drive_item_id = "01DK5X4ULZXXTR6JXRMJEJ4OSUML6QFPOV";

  try {
    let response = await graphClient
      .api(`/me/drive/items/${drive_item_id}/content`)
      .responseType("blob")
      .get();

    return response;

    //await sendExcelDataToPython(response);
    //await blobToDataURL(response);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function blobToDataURL(blob) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function () {
      const dataURL = reader.result;
      resolve(dataURL);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

// Assuming you have 'excelBlob' from your previous code
async function sendExcelDataToPython(excelBlob) {
  try {
    let excelFileDataURL = await blobToDataURL(excelBlob);
    console.log(excelFileDataURL);

    const requestBody = {
      dataURL: excelFileDataURL,
    };

    let response = await fetch("http://localhost:8000/processExcel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

async function readExcelFile() {
  let excelBlobFile = await createExcelBlobFile();
  await sendExcelDataToPython(excelBlobFile);
}

async function viewProfile() {
  ensureScope("user.read");
  return await graphClient.api("/me").get();
}
