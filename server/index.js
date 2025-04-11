const express = require("express");
const app = express();
const cors = require('cors');
const passport = require("passport");
const reflect = require("reflect-metadata");
require('dotenv').config(); 
const dataSource = require("./db/dataSource");
const auth = require("./middleware/authenticate");
const loginRouter = require("./routes/loginRouter");
const homeRouter = require("./routes/homeRouter");
const signUpRouter = require("./routes/signUpRouter");

app.use(cors({
  origin: function(origin, callback) {
    
    const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

auth.setupAuth(app);

app.use(loginRouter); 
app.use(homeRouter);
app.use(signUpRouter);

app.listen(3000, async () => {
    try {
      await dataSource.initialize();
      console.log("App listening on port 3000!");
    } catch (error) {
      console.error("Error during Data Source initialization", error);
    }
});