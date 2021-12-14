import express from "express";

import createFilesRoutes from "./routes/files";

const createServer = () => {
  const app = express();

  app.use(createFilesRoutes());

  return app;
};

export default createServer;
