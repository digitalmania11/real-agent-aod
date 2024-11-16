const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
}).fields([{ name: "VideoPitch", maxCount: 1 }]);

const handleUpload = (req, res, next) => {
  console.log("Uploaded files:", req.files);
  if (!req.files || !req.files.VideoPitch || req.files.VideoPitch.length === 0) {
    return res.status(400).json({ error: "VideoPitch file is required." });
  }
  next();
};

module.exports = { upload, handleUpload };
