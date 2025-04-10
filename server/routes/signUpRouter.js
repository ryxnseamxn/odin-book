const { Router } = require("express"); 
const router = Router();
const signUpController = require("../controllers/signUpController");

router.post("/signup", signUpController.signUp);

module.exports = router;