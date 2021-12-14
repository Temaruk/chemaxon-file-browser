import express from "express";
import multer from "multer";
import * as fs from "fs/promises";

const PORT = 8000;

const app = express();

const FILE_SIZE_MB_MAX = 3 * 1024 * 1024;
const DIRECTORY_PATH_UPLOADS = "./uploads";

const storage = multer.diskStorage({
  destination: DIRECTORY_PATH_UPLOADS,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadSingleFile = multer({
  storage,
  limits: { fileSize: FILE_SIZE_MB_MAX },
}).single("file");

app.post("/api/files", uploadSingleFile, (req, res) => {
  // TODO: take file from req and upload to S3
  // TODO: store reference to file in DB ?
  // TODO: delete local file
  res.sendStatus(200);
});

type FileEntry = {
  filename: string;
  uploadDate: number;
};

app.get("/api/files", async (req, res) => {
  let result: FileEntry[] = [];

  // TODO: list files from S3 instead of local file system

  let files: string[] = [];
  try {
    files = await fs.readdir(DIRECTORY_PATH_UPLOADS);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Could not load files from server. " + err,
    });
  }

  for (const file of files) {
    const fileStats = await fs.stat(`${DIRECTORY_PATH_UPLOADS}/${file}`);

    result.push({
      filename: file,
      uploadDate: fileStats.birthtimeMs,
    });
  }

  res.json(result);
});

app.get("/api/files/:fileName", (req, res) => {
  // TODO: donwload file from S3

  const fileName = req.params.fileName;

  res.download(`${DIRECTORY_PATH_UPLOADS}/${fileName}`, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
