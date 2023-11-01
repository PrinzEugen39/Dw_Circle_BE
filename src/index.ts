import { AppDataSource } from "./data-source";
import * as express from "express";
import router from "./route";
import * as cors from "cors";
import "dotenv/config"

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 5069;

    app.use(cors());
    app.use(express.json());
    app.use("/api/v1", router);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log("Made by PrinzEugen39")
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
