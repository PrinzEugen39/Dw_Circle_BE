import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Replies } from "../entities/Replies";
import {
  createRepliesSchema,
  updateRepliesSchema,
} from "../utils/validation/RepliesValidation";

export default new (class RepliesService {
  private readonly RepliesRepository: Repository<Replies> =
    AppDataSource.getRepository(Replies);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const reply = await this.RepliesRepository.find({
        relations: ["user_id", "thread_id"],
      });

      return res.status(200).json(reply);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error while getting all the replies" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createRepliesSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }
      //   console.log(value);

      const replies = this.RepliesRepository.create({
        content: value.content,
        image: value.image,
        thread_id: value.thread_id,
        user_id: value.user_id,
      });

      const createdReplies = await this.RepliesRepository.save(replies);
      res.status(200).json(createdReplies);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.RepliesRepository.findOne({
        where: {
          id: id,
        },
        relations: ["user_id", "thread_id"],
      });
      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({ error: "Error while getting a reply" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const replies = await this.RepliesRepository.findOne({
        where: { id: id },
      });
      if (!replies)
        return res.status(400).json({ error: `Thread at ${id} not found` });

      const data = req.body;
      const { error, value } = updateRepliesSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      if (value.content != "") replies.content = value.content;
      if (value.image != "") replies.image = value.image;

      const update = await this.RepliesRepository.save(replies);
      return res.status(200).json(update);
    } catch (error) {
      return res.status(500).json({ error: "Error while getting a reply" });
    }
  }
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const replies = await this.RepliesRepository.findOne({
        where: { id: id },
      });

      if (!replies)
        return res.status(404).json({ Error: "reply ID not found" });

      const response = await this.RepliesRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }
})();
