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
} = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

router.post("/signup", validationCreateUser, signup);
router.post("/login", validationLoginUser, login);
router.post("/logout", guard, logout);
router.post("/current", guard, currentUser);
router.patch("/", guard, validationSubscriptionUpdate, changeSubscription);

module.exports = router;
