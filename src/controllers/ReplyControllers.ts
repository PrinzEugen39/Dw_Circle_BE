import { Request, Response } from "express";
import RepliesServices from "../services/RepliesServices";

export default new (class UserControllers {
  find(req: Request, res: Response) {
    RepliesServices.find(req, res);
  }
  create(req: Request, res: Response) {
    RepliesServices.create(req, res);
  }
  findOne(req: Request, res: Response) {
    RepliesServices.findOne(req, res);
  }
  update(req: Request, res: Response) {
    RepliesServices.update(req, res);
  }
  delete(req: Request, res: Response) {
    RepliesServices.delete(req, res);
  }
})();
