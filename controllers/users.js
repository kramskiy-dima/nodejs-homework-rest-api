const Users = require("../repositories/users");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const { HttpCode } = require("../helpers/constans");
const UploadAvatar = require("../services/upload-avatar");
const User = require("../model/user");
const { CreateSenderSendGrid } = require("../services/email-sender");
const EmailService = require("../services/email");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email is already used",
      });
    }

    const {
      id,
      email,
      subscription,
      avatarURL,
      verifyToken,
    } = await Users.createUser(req.body);

    try {
      const emailSend = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
      );
      console.log(emailSend);

      await emailSend.sendVerifyEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatar: avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword || !user.verifyToken) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    const id = user.id;
    const payload = { id, test: "Nadezhda the best" };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatar: user.avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  const { email, subscription, avatarURL } = req.user;
  try {
    if (req.user) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: {
          email,
          subscription,
          avatarURL,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const changeSubscription = async (req, res, next) => {
  try {
    const { subscription } = await Users.updateSubscription(
      req.user.id,
      req.body.subscription
    );

    return res.json({
      status: "success",
      code: HttpCode.OK,
      subscription,
    });
    // }
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar("avatars");
    const avatarURL = await uploads.saveAvatar({ file: req.file });

    try {
      await fs.unlink(path.join("public", req.user.avatarURL));
    } catch (error) {
      console.log(error);
    }

    await Users.updateAvatar(id, avatarURL);
    res.json({ status: "success", code: HttpCode.OK, data: { avatarURL } });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verificationToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { message: "Verification successful!" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

const repeatEmailSend = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { email, verify, verifyToken } = user;
      if (!verify) {
        const emailSender = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid()
        );
        await emailSender.sendVerifyEmail(verifyToken, email);
        return res.status(HttpCode.OK).json({
          status: "seccuess",
          code: HttpCode.OK,
          data: { message: "Verification email sent" },
        });
      } else {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: "error",
          code: HttpCode.BAD_REQUEST,
          message: "Verification has already been passed",
        });
      }
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  changeSubscription,
  avatars,
  verify,
  repeatEmailSend,
};
