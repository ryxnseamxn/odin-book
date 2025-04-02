const express = require("express");
const reflect = require("reflect-metadata");
const dataSource = require("./db/config");

const app = express();

app.listen(3001, async () => {
    try {
      await dataSource.initialize();
      console.log("App listening on port 3001!");
      console.log(`${dataSource.isInitialized}`)
    } catch (error) {
      console.error("Error during Data Source initialization", error);
    }
});