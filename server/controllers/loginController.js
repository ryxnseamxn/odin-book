const db = require("../db/dataSource");

exports.login = (req, res) => {
    res.status(200).json({
      message: "Login successful",
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  };
