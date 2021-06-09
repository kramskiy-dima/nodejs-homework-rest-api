const User = require("../model/user");

const createUser = async (body) => {
  const user = new User(body);
  return await user.save();
};

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscription = async (token, subscription) => {
  return await User.findOneAndUpdate(
    { token },
    { subscription },
    {
      returnOriginal: false,
    }
  );
};

module.exports = {
  createUser,
  findById,
  findByEmail,
  updateToken,
  updateSubscription,
};
