import { Request, Response } from "express";
import { MulterError } from "multer";
import * as fs from "fs/promises";

import { DIRECTORY_PATH_UPLOADS, FILE_SIZE_MAX_MB } from "../constants";
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

type FileEntry = {
  filename: string;
  uploadDate: number;
};

export const getFiles = async (req: Request, res: Response) => {
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
};

export const download = (req: Request, res: Response) => {
  // TODO: donwload file from S3

  const fileName = req.params.fileName;

  res.download(`${DIRECTORY_PATH_UPLOADS}/${fileName}`, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
