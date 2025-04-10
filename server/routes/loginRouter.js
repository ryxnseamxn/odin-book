const { Router } = require("express"); 
const router = Router();
const loginController = require("../controllers/loginController");
const { authenticate } = require("../middleware/authenticate");     

router.post("/login", authenticate, loginController.login)

module.exports = router;