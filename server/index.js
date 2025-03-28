const express = require("express");
const reflect = require("reflect-metadata");
const dataSource = require("./db/config");

const app = express();

app.listen(3001, async () => {
    await dataSource.initialize();
    console.log("app listening on port 3000!")
});