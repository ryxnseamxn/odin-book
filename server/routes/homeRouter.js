const { Router } = require("express"); 
const router = Router();
const homeController = require("../controllers/homeController")
const { isAuthenticated } = require("../middleware/authenticate"); 

router.get("/", isAuthenticated, homeController.authenticate);
router.get("/user", isAuthenticated, homeController.getUser);
router.get("/friends", isAuthenticated, homeController.getFriends);
router.get("/search-users", isAuthenticated, homeController.searchUsers);
router.post("/add-friend", isAuthenticated, homeController.addFriend); 
router.post("/remove-friend", isAuthenticated, homeController.removeFriend);


module.exports = router;