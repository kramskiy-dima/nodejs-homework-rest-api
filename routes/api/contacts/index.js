const express = require("express");
const router = express.Router();
const guard = require("../../../helpers/guard");
const {
  getAll,
  getById,
  createContact,
  removeContact,
  updateContact,
  updateContactStatus,
} = require("../../../controllers/contacts");
const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateStatusContact,
} = require("./validation");

router
  .get("/", guard, getAll)
  .post("/", guard, validationAddContact, createContact);

router
  .get("/:contactId", guard, getById)
  .delete("/:contactId", guard, removeContact)
  .put("/:contactId", guard, validationUpdateContact, updateContact);

router.patch(
  "/:contactId/favorite",
  guard,
  validationUpdateStatusContact,
  updateContactStatus
);

module.exports = router;
