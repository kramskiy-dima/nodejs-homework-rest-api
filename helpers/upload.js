const multer = require("multer");
const { HttpCode } = require("../helpers/constans");

require("dotenv").config();
const TEMP_DIR = process.env.TEMP_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
      return;
    }
    const error = new Error("Wrong format file for avatar");
    error.status = HttpCode.BAD_REQUEST;
    cb(error);
  },
});

module.exports = upload;
