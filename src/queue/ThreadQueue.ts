import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validation/ThreadValidation";
import MessageQueue from "../libs/rabbitmq";

type QueuePayload = {
  content: string;
  image: string;
  user_id: number;
};

export default new (class ThreadQueue {
  async create(req: Request, res: Response) {
    try {
      const loginSession = res.locals.loginSession;
      // cloudinary.config({
      //   cloud_name: "dl7ttedsi",
      //   api_key: "587567672326331",
      //   api_secret: "Wd81XWachtK10Bd5GrbPuy-epyo",
      // });
      

      // let image;
      // if (res.locals.filename) {
      //   image = res.locals.filename;
      //   // cloudinary uploader
      //   const cloudinaryResponse = await cloudinary.uploader.upload(
      //     "src/uploads/" + image,
      //     {
      //       folder: "circle-app",
      //     }
      //   );
      //   image = cloudinaryResponse.secure_url;
      // }

      const data = {
        content: req.body.content,
        image: res.locals.filename,
      };

      const { error, value } = createThreadSchema.validate(data);
      if (error)
        return res.status(400).json({ Error: `error validation ${error}` });

      const payload: QueuePayload = {
        content: value.content,
        image: value.image,
        user_id: loginSession.user.id,
      };

      const errorQueue = await MessageQueue.MessageSend(
        process.env.THREAD,
        payload
      );
      if (errorQueue)
        return res
          .status(500)
          .json({
            Error: `something went wrong while sending message :${errorQueue}`,
          });

      return res.status(201).json({
        message: "Thread is queued !",
        data: payload,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ Error: `error in threadqueue method: ${error}` });
    }
  }
})();
