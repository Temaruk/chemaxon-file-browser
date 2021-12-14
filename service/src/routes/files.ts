import express from "express";

import * as fileController from "../controller/file.controller";

const routes = () => {
  const router = express.Router();

  router.post("/api/files", fileController.upload);
  router.get("/api/files", fileController.getFiles);

  return router;
};

export default routes;
