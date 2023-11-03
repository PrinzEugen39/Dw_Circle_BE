import { Request, Response } from "express";
import UserServices from "../services/UserServices";

export default new (class UserControllers {
  find(req: Request, res: Response) {
    UserServices.find(req, res);
  }
  create(req: Request, res: Response) {
    UserServices.create(req, res);
  }
  findOne(req: Request, res: Response) {
    UserServices.findOne(req, res);
  }
  update(req: Request, res: Response) {
    UserServices.update(req, res);
  }
  delete(req: Request, res: Response) {
    UserServices.delete(req, res);
  }
  follow(req: Request, res: Response) {
    UserServices.follow(req, res);
  }
  updatePW(req: Request, res: Response) {
    UserServices.updatebyJWT(req, res);
  }
})();
