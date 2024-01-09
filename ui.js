//ui.js
const app = Vue.createApp({
  data() {
    return {
      userName: "",
      userInfo: "",
      isSignedIn: false,
      excelData: "Data",
    };
  },
  methods: {
    async displayUI() {
      await signIn();
      const user = await getUser();
      this.userName = user.displayName;
      this.showContent = true;
      this.isSignedIn = true;
    },
    async displayUserInfo() {
      const modifiedUserInfo = await viewProfile();
      this.userInfo = JSON.stringify(modifiedUserInfo);
    },
    async modifyUserInfo() {
      const userInfo = await viewProfile();
      const apiurl = "http://127.0.0.1:8000/modifiedUserInfo";
      try {
        const response = await fetch(apiurl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });
        const data = await response.json();
        this.userInfo = JSON.stringify(data);
      } catch (error) {
        console.error(error);
      }
    },
    async showExcelurl() {
      const excelData = await readExcelFile1();
      this.excelData = JSON.stringify(excelData);
    },
  },
});

app.mount("#app");
