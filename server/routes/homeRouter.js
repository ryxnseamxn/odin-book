const { Router } = require("express"); 
const router = Router();
const homeController = require("../controllers/homeController")
const { isAuthenticated } = require("../middleware/authenticate"); 

router.get("/", isAuthenticated, homeController.authenticate);

module.exports = router;