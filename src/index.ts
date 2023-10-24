import { AppDataSource } from "./data-source";
import * as express from "express";
import router from "./route";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 5069;

    app.use(express.json());
    app.use("/api/v1", router);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
