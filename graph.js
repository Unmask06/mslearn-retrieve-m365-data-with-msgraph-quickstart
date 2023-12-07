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

async function readExcelFile() {
  ensureScope("Files.ReadWrite");
  let drive_item_id = "01DK5X4ULZXXTR6JXRMJEJ4OSUML6QFPOV";
  let worksheets = await graphClient
    .api(`/me/drive/items/${drive_item_id}/workbook/worksheets`)
    .get();
    console.log(worksheets);
    console.log(await authProvider.getAccessToken());
  return worksheets;
}
