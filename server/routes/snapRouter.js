const { Router } = require("express"); 
const router = Router();
const snapController = require("../controllers/snapController")
const { isAuthenticated } = require("../middleware/authenticate"); 
const { handleUpload } = require("../services/multerService");

router.post("/snap-friend", isAuthenticated, handleUpload, snapController.snapFriend)
router.post("/mark-snap-viewed", isAuthenticated, snapController.markSnapAsViewed);
router.get("/pending-snaps", isAuthenticated, snapController.getPendingSnaps)

module.exports = router;