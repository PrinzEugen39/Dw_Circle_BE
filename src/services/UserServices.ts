import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entities/User";
import {
  createUserSchema,
  updateUserSchema,
} from "../utils/validation/UserValidation";
import * as bcrypt from "bcrypt";
import { RedisClient, DEFAULT_EXPIRATION } from "../utils/caching-redis/redis";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.UserRepository.find({
        relations: ["following", "followers"],
      });

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
      const loginSession = res.locals.loginSession;

      if (!loginSession) {
        return res.status(401).json({ error: "Unauthorized ga tau ngapa" });
      }
      const redisKey = loginSession.user.id.toString();
      const RedisCache = await RedisClient.get(redisKey);
      if (RedisCache) {
        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Find one user from cache",
          data: JSON.parse(RedisCache),
        });
      } else {
        const user = await this.UserRepository.findOne({
          where: {
            id: loginSession.user.id,
          },
          relations: ["following", "followers", "threads"],
        });

        RedisClient.setEx(
          redisKey,
          DEFAULT_EXPIRATION,
          JSON.stringify(user)
        );

        return res.status(200).json(user);
      }
    } catch (error) {
      console.error("Error in findOne:", error);      
      return res.status(500).json({ error: `${error}` });
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

      // Hash the new password before saving it
      if (value.password) {
        const hashedPassword = await bcrypt.hash(value.password, 10);
        user.password = hashedPassword;
      }

      user.email = value.email;
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

  async updatebyJWT(req: Request, res: Response): Promise<Response> {
    try {
      const loginSession = res.locals.loginSession;
      const user = await this.UserRepository.findOne({
        where: { id: loginSession.user.id },
      });
      const data = req.body;
      const { error, value } = updateUserSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Hash the new password before saving it
      if (value.password) {
        const hashedPassword = await bcrypt.hash(value.password, 10);
        user.password = hashedPassword;
      }

      user.email = value.email;
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

      if (!thread) return res.status(404).json({ Error: "User ID not found" });

      const response = await this.UserRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }

  async follow(req: Request, res: Response): Promise<Response> {
    try {
      const loginSession = res.locals.loginSession;
      const followingId = Number(req.body.followingId);

      const follower = await this.UserRepository.findOne({
        where: { id: loginSession.user.id },
        relations: ["following"],
      });
      const following = await this.UserRepository.findOne({
        where: { id: followingId },
      });

      if (!follower || !following) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the follower is already following the user
      const isFollowing = follower.following.some(
        (user) => user.id === following.id
      );

      if (isFollowing) {
        // If they are already following, unfollow
        follower.following = follower.following.filter(
          (user) => user.id !== following.id
        );
      } else {
        // If they are not following yet, follow
        follower.following.push(following);
      }

      await this.UserRepository.save(follower);

      return res.status(200).json(follower);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error while following/unfollowing user" });
    }
  }
})();
