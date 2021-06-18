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

const updateSubscription = async (id, subscription) => {
  return await User.findByIdAndUpdate(
    { _id: id },
    { subscription },
    {
      returnOriginal: false,
    }
  );
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken });
};

module.exports = {
  createUser,
  findById,
  findByEmail,
  updateToken,
  updateSubscription,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
};
