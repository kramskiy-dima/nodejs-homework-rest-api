const express = require("express");
const router = express.Router();
const {
  validationCreateUser,
  validationLoginUser,
  validationSubscriptionUpdate,
} = require("./validation");
const {
  signup,
  login,
  logout,
  currentUser,
  changeSubscription,
  avatars,
} = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

router.post("/signup", validationCreateUser, signup);
router.post("/login", validationLoginUser, login);
router.post("/logout", guard, logout);
router.post("/current", guard, currentUser);
router.patch("/", guard, validationSubscriptionUpdate, changeSubscription);
router.patch("/avatars", guard, upload.single("avatar"), avatars);

module.exports = router;
