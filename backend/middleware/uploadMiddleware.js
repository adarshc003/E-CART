const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: function (req, file, cb) {
    const allowed = /jpg|jpeg|png/;
    const ext = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (ext) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

module.exports = upload;
