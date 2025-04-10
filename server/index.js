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

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

auth.setupAuth(app);

app.use(loginRouter); 
app.use(homeRouter);
app.use(signUpRouter);

app.listen(3001, async () => {
    try {
      await dataSource.initialize();
      console.log("App listening on port 3001!");
    } catch (error) {
      console.error("Error during Data Source initialization", error);
    }
});