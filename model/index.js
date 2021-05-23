const fs = require("fs/promises");
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.join(__dirname, "contacts.json");

const readData = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  return contacts;
};

const listContacts = async () => {
  return await readData();
};

const getContactById = async (contactId) => {
  const data = await readData();
  const [result] = data.filter((contact) => contact.id === +contactId);
  return result;
};

const removeContact = async (contactId) => {
  const data = await readData();
  const index = data.findIndex((contact) => contact.id === +contactId);
  if (index !== -1) {
    const result = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data));
    return result;
  }
  return null;
};

const addContact = async (body) => {
  const id = shortid();
  const newContact = {
    id,
    ...body,
    ...(body.isVaccinated ? {} : { isVaccinated: false }),
  };
  const data = await readData();
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = await readData();
  const [result] = data.filter((contact) => contact.id === +contactId);
  if (result) {
    Object.assign(result, body);
    await fs.writeFile(contactsPath, JSON.stringify(data));
  }
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
