const guard = require("../helpers/guard");
const { HttpCode } = require("../helpers/constans");
const passport = require("passport");

describe("Unit test guard", () => {
  const user = { token: "111111111" };
  const req = { get: jest.fn((header) => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  test("header Authorization no token", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => {
        cb(null, false);
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  test("user token is invalid", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => {
        cb(null, { token: "1" });
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  test("user token is valid", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => {
        cb(null, { token: "111111111" });
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
  });
});
