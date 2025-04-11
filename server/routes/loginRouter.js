const { Router } = require("express"); 
const router = Router();
const loginController = require("../controllers/loginController");
const { authenticate } = require("../middleware/authenticate");     

router.post("/login", authenticate, loginController.login)
router.post("/logout", loginController.logout);

module.exports = router;