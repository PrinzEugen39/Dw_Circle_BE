import { Request, Response } from "express";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import {
  loginSchema,
  registerSchema,
} from "../utils/validation/AuthValidation";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export default new (class AuthServices {
  private readonly AuthRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = registerSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: `${error}` });
      }

      const isCheckEmail = await this.AuthRepository.count({
        where: { email: value.email },
      });

      if (isCheckEmail > 0) {
        return res.status(400).json({
          Error: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);

      const user = this.AuthRepository.create({
        email: value.email,
        password: hashedPassword,
        username: value.username,
        full_name: value.full_name,
      });

      const createdUser = await this.AuthRepository.save(user);
      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(500).json({
        Error: `${error}`,
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { value } = loginSchema.validate(data);

      const isCheckEmail = await this.AuthRepository.findOne({
        where: { email: value.email },
        select: ["id", "full_name", "email", "password", "username"],
      });

      if (!isCheckEmail) {
        return res.status(404).json({
          Error: "Email not found",
        });
      }

      const isCheckPassword = await bcrypt.compare(
        value.password,
        isCheckEmail.password
      );

      if (!isCheckPassword) {
        return res.status(404).json({
          Error: "incorect password",
        });
      }

      const user = this.AuthRepository.create({
        id: isCheckEmail.id,
        full_name: isCheckEmail.full_name,
        email: isCheckEmail.email,
        username: isCheckEmail.username,
      });

      const token = await jwt.sign({ user }, "secret", { expiresIn: "1h" });

      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      return res.status(500).json({
        Error: `${error}`,
      });
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    try {
      const loginSession = res.locals.loginSession;

      const user = await this.AuthRepository.findOne({
        where: { id: loginSession.user.id },
      })

      return res.status(200).json({ user, message: "You are logged in" });
    } catch (error) {
      return res.status(500).json({
        Error: `${error}`,
      });
    }
  }
})();
