import express from "express";
import * as fs from "fs/promises";

import creteFilesRoutes from "./routes/files";
import { DIRECTORY_PATH_UPLOADS, PORT } from "./constants";

const app = express();

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

app.use(creteFilesRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
