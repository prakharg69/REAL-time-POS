import multer from "multer";
import path from "path";
import fs from "fs";

const TEMP_DIR = "uploads/temp";

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedMime =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype !== allowedMime || ext !== ".xlsx") {
    return cb(new Error("Only .xlsx files allowed"), false);
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const shopId = req.userId || "user";
    const fileName = `${shopId}_${Date.now()}.xlsx`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

export default upload;