import express from "express";

import createFilesRoutes from "./routes/files";
import { PORT } from "./constants";

const app = express();

app.use(createFilesRoutes());

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
