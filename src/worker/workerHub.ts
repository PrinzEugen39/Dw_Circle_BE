import { AppDataSource } from "../data-source";
import cloudinary from "../libs/cloudinary";
import * as amqp from "amqplib";
import ThreadWorker from "./ThreadWorker";

export default new (class WorkerHub {
  constructor() {
    AppDataSource.initialize()
      .then(async () => {
        cloudinary.upload();

        const connection = await amqp.connect('amqp://localhost');
        // console.log("test connection", connection);
        
        //create worker
        const resp = await ThreadWorker.create("threads-queue", connection);
        console.log("test response", resp);
      })
      .catch((error) => {
        console.log(error);
      });
  }
})();
