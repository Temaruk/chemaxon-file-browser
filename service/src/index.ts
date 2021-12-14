import { PORT } from "./constants";
import createServer from "./server";

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
