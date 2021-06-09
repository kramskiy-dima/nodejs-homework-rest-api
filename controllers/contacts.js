const Contacts = require("../repositories/contacts");
const { HttpCode } = require("../helpers/constans");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, ...rest } = await Contacts.listContacts(
      userId,
      req.query
    );
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { contacts, ...rest },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    console.log(contact);
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact(userId, req.body);
    return res
      .status(HttpCode.CREATED)
      .json({ status: "success", code: HttpCode.CREATED, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateStatusContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  createContact,
  removeContact,
  updateContact,
  updateContactStatus,
};
