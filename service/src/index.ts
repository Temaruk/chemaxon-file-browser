import express from "express";

import createFilesRoutes from "./routes/files";
import { DIRECTORY_PATH_UPLOADS, PORT } from "./constants";

const app = express();

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

app.use(createFilesRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
