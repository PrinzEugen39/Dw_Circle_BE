import { Repository } from "typeorm";
import { Threads } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import {
  createThreadSchema,
  updateThreadSchema,
} from "../utils/validation/ThreadValidation";
import { v2 as cloudinary } from "cloudinary";

export default new (class ThreadService {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const threads = await this.ThreadRepository.find({
        relations: ["user_id", "like.user_id", "replies"],
        select: {
          user_id: {
            id: true,
            username: true,
            full_name: true,
            profile_picture: true,
          },
          like: {
            id: true,
            created_at: true,
            updated_at: true,
            user_id: {
              id: true,
              username: true,
              full_name: true,
              profile_picture: true,
            },
          },
        },
        order: {
          id: "DESC",
        },
      });

      return res.status(200).json(
        threads.map((thread) => ({
          ...thread,
          numOfLikes: thread.like.length,
          numOfReplies: thread.replies.length,
        }))
      );
    } catch (err) {
      return res.status(500).json({ error: "Error while getting threads" });
    }
  }
  async create(req: Request, res: Response): Promise<Response> {
    try {
      cloudinary.config({
        cloud_name: "dl7ttedsi",
        api_key: "587567672326331",
        api_secret: "Wd81XWachtK10Bd5GrbPuy-epyo",
      });
      

      let image;
      if (res.locals.filename) {
        image = res.locals.filename;
        // cloudinary uploader
        const cloudinaryResponse = await cloudinary.uploader.upload(
          "src/uploads/" + image,
          {
            folder: "circle-app",
          }
        );
        image = cloudinaryResponse.secure_url;
      }

      const data = {
        content: req.body.content,
        image: image,
      };

      const loginSession = res.locals.loginSession;

      const { error, value } = createThreadSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      const thread = this.ThreadRepository.create({
        content: value.content,
        image: image, 
        user_id: {
          id: loginSession.user.id,
        },
      });

      const createdThread = await this.ThreadRepository.save(thread);
      return res.status(200).json(createdThread); // make sure to return the response
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  
  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.createQueryBuilder("thread")
        .leftJoinAndSelect("thread.user_id", "user")
        .leftJoinAndSelect("thread.replies", "replies")
        .leftJoinAndSelect("replies.user_id", "replyUser")
        .where("thread.id = :id", { id })
        .orderBy("replies.id", "DESC")
        .getOne();

      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({ error: "Error while getting a thread" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: { id: id },
      });
      if (!thread)
        return res.status(400).json({ error: `Thread at ${id} not found` });

      const data = req.body;
      const { error, value } = updateThreadSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      if (value.content != "") thread.content = value.content;
      if (value.image != "") thread.image = value.image;

      const update = await this.ThreadRepository.save(thread);
      return res.status(200).json(update);
    } catch (error) {
      res.status(500).json({ error: "Error while updating thread" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: { id: id },
      });

      if (!thread)
        return res.status(404).json({ Error: "Thread ID not found" });

      const response = await this.ThreadRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }
})();
