import { Repository } from "typeorm";
import { Threads } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validation/Thread";

export default new (class ThreadService {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const threads = await this.ThreadRepository.find({
        relations: ["userId"],
      });

      let newResponse = [];
      threads.forEach((data) => {
        newResponse.push({
          ...data,
          likes_count: Math.floor(Math.random() * 10),
          replies_count: Math.floor(Math.random() * 10),
        });
      });

      return res.status(200).json(newResponse);
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
      console.log(data);
      const thread = this.ThreadRepository.create({
        content: value.content,
        image: value.image,
        userId: value.userId
      });

      const createdThread = await this.ThreadRepository.save(thread);
      res.status(200).json(createdThread);
    } catch (err) {
      return res.status(500).json({ error: "Error while creating thread" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id: id,
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
      const data = req.body;
      const { error, value } = createThreadSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      thread.content = value.content;
      thread.image = value.image;

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
