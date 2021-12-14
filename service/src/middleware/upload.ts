import multer from "multer";
import util from "util";

import { DIRECTORY_PATH_UPLOADS, FILE_SIZE_MAX_BYTES } from "../constants";

const storage = multer.diskStorage({
  destination: DIRECTORY_PATH_UPLOADS,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadSingleFile = multer({
  storage,
  limits: { fileSize: FILE_SIZE_MAX_BYTES },
}).single("file");

const asyncUploadSingleFile = util.promisify(uploadSingleFile);

export default asyncUploadSingleFile;
