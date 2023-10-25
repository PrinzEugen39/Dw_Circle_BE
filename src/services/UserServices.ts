import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entities/User";
import { createUserSchema, updateUserSchema } from "../utils/validation/UserValidation";

export default new (class ThreadService {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.UserRepository.find();

      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error while getting all the users" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = createUserSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      const users = this.UserRepository.create({
        email: value.email,
        password: value.password,
        username: value.username,
        full_name: value.full_name,
        profile_picture: value.profile_picture,
        profile_description: value.profile_description,
      });

      const createdUsers = await this.UserRepository.save(users);
      res.status(200).json(createdUsers);
    } catch (error) {
      return res.status(500).json({ error: "Error while creating users" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.UserRepository.findOne({
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
      const user = await this.UserRepository.findOne({
        where: { id: id },
      });
      const data = req.body;
      const { error, value } = updateUserSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      user.email = value.email;
      user.password = value.password;
      user.username = value.username;
      user.full_name = value.full_name;
      user.profile_picture = value.profile_picture;
      user.profile_description = value.profile_description;

      const update = await this.UserRepository.save(user);
      return res.status(200).json(update);
    } catch (error) {
      res.status(500).json({ error: "Error while updating user" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.UserRepository.findOne({
        where: { id: id },
      });

      if (!thread)
        return res.status(404).json({ Error: "User ID not found" });

      const response = await this.UserRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }
})();
