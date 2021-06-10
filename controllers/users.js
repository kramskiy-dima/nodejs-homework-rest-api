const Users = require("../repositories/users");
const jwt = require("jsonwebtoken");
const { HttpCode } = require("../helpers/constans");
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

    const { id, name, email, subscription } = await Users.createUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, name, email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
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
        user: { email: user.email, subscription: user.subscription },
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
  const { email, subscription } = req.user;
  try {
    if (req.user) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: {
          email,
          subscription,
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

module.exports = { signup, login, logout, currentUser, changeSubscription };
