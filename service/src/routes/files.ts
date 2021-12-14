import express from "express";

import * as fileController from "../controller/file.controller";

const routes = () => {
  const router = express.Router();

  router.post("/api/files", fileController.upload);

  return router;
};

export default routes;
