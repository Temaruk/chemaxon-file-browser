import { Request, Response, NextFunction, RequestHandler } from "express";
import { MulterError } from "multer";

import { FILE_SIZE_MAX_MB } from "../constants";
import asyncUploadSingleFile from "../middleware/upload";

export const upload = async (req: Request, res: Response) => {
  try {
    await asyncUploadSingleFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // TODO: take file from req and upload to S3
    // TODO: store reference to file in DB ?
    // TODO: delete local file

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err instanceof MulterError && err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: `File size cannot be larger ${FILE_SIZE_MAX_MB}MB!`,
      });
    }

    res.status(500).send({
      message: `Could not upload the file. ${err}`,
    });
  }
};
