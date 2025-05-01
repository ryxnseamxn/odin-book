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
const snapRouter = require("./routes/snapRouter");
const { ensureBucketExists } = require("./services/bucket"); 
const { createProxyMiddleware } = require('http-proxy-middleware');


const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use('/minio-proxy', createProxyMiddleware({
  target: 'http://minio:9000',
  changeOrigin: true,
  pathRewrite: {
    '^/minio-proxy': '', 
  },
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


auth.setupAuth(app);

app.use(loginRouter); 
app.use(homeRouter);
app.use(signUpRouter);
app.use(snapRouter);

app.listen(3001, async () => {
    try {
      await dataSource.initialize();
      console.log("App listening on port 3001!");

      await ensureBucketExists();
      console.log("MinIO storage initialized successfully");
    } catch (error) {
      console.error("Error during Data Source initialization", error);
    }
});