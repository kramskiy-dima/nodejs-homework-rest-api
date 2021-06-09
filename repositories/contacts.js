const Contact = require("../model/contact");

const listContacts = async (userId, query) => {
  const { favorite = null, limit = 10, offset = 0 } = query;

  const optionSearch = { owner: userId };
  if (favorite !== null) {
    optionSearch.favorite = favorite;
  }

  const results = await Contact.paginate(optionSearch, {
    limit,
    offset,
    populate: { path: "owner", select: "email subscription -_id" },
  });
  return results;
};

const getContactById = async (userId, id) => {
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "email",
  });
  return result;
};

const removeContact = async (userId, id) => {
  const result = await Contact.findOneAndRemove({ _id: id, owner: userId });
  return result;
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ owner: userId, ...body });
  return result;
};

const updateContact = async (userId, id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (userId, id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
