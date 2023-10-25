import { Repository } from "typeorm";
import { Threads } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import {
  createThreadSchema,
  updateThreadSchema,
} from "../utils/validation/ThreadValidation";

export default new (class ThreadService {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const threads = await this.ThreadRepository.find({
        select: {
          id: true,
          content: true,
          image: true,
          created_at: true,
          user_id: {
            id: true,
            full_name: true,
            username: true,
            email: true,
            profile_picture: true,
          },
        },
        relations: {
          user_id: true,
          replies: true,
          like: true,
        },
        order: {
          id: "DESC",
        },
      });

      return res.status(200).json(threads);
    } catch (err) {
      return res.status(500).json({ error: "Error while getting threads" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createThreadSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }
      const thread = this.ThreadRepository.create({
        content: value.content,
        image: value.image,
        user_id: value.user_id,
      });

      const createdThread = await this.ThreadRepository.save(thread);
      res.status(200).json(createdThread);
    } catch (err) {
      return res.status(500).json({ error: `${err}` });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id: id,
        },
        select: {
          id: true,
          content: true,
          image: true,
          created_at: true,
          user_id: {
            id: true,
            full_name: true,
            username: true,
            email: true,
            profile_picture: true,
          },
        },
        relations: {
          user_id: true,
          replies: true,
          like: true,
        },
      });
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
