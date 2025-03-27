const express = require("express");
const reflect = require("reflect-metadata")

const app = express();

app.listen(3001, () => {
    console.log("app listening on port 3000!")
});