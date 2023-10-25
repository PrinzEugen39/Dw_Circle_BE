import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createLikeSchema } from "../utils/validation/LikesValidation";
import { Likes } from "../entities/Likes";

export default new (class LikeService {
  private readonly LikesRepository: Repository<Likes> =
    AppDataSource.getRepository(Likes);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const like = await this.LikesRepository.find({
        relations: ["user_id", "threads_id"],
      });

      return res.status(200).json(like);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `${error}` });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createLikeSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: `${error}` });
      }
      
      const like = this.LikesRepository.create({
        threads_id: value.threads_id,
        user_id: value.user_id,
      });

      const createdReplies = await this.LikesRepository.save(like);
      res.status(200).json(createdReplies);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const like = await this.LikesRepository.findOne({
        where: {
          id: id,
        },
        relations: ["user_id", "threads_id"],
      });
      return res.status(200).json(like);
    } catch (error) {
      return res.status(500).json({ Error: `${error}` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const like = await this.LikesRepository.findOne({
        where: { id: id },
      });

      if (!like)
        return res.status(404).json({ Error: "like ID not found" });

      const response = await this.LikesRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }
})();
