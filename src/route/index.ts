import * as express from "express";
import ThreadControllers from "../controllers/ThreadControllers";
import UserControllers from "../controllers/UserControllers";
import ReplyControllers from "../controllers/ReplyControllers";
import LikeControllers from "../controllers/LikeControllers";
import AuthControllers from "../controllers/AuthControllers";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import uploadFile from "../middlewares/uploadFile";

const router = express.Router();

//auth router
router.post("/auth/register", AuthControllers.register);
router.post("/auth/login", AuthControllers.login);
router.get("/auth/check", AuthMiddleware.Authentication, AuthControllers.check);

//thread router
router.get("/threads", ThreadControllers.find);
router.get("/thread/:id", ThreadControllers.findOne);
router.post(
  "/thread",
  AuthMiddleware.Authentication,
  uploadFile.Upload("image"),
  ThreadControllers.create
);
router.patch("/thread/:id", ThreadControllers.update);
router.delete("/thread/:id", ThreadControllers.delete);

//user router
router.get("/users", UserControllers.find);
router.get("/user", AuthMiddleware.Authentication, UserControllers.findOne);
router.post("/users", UserControllers.create);
router.patch("/user/:id", UserControllers.update);
router.patch(
  "/userpw/",
  AuthMiddleware.Authentication,
  UserControllers.updatePW
);
router.delete("/user/:id", UserControllers.delete);

router.post("/follow/", AuthMiddleware.Authentication, UserControllers.follow);

//reply router
router.get("/replies", ReplyControllers.find);
router.get("/reply/:id", ReplyControllers.findOne);
router.post(
  "/replies",
  AuthMiddleware.Authentication,
  uploadFile.Upload("image"),
  ReplyControllers.create
);
router.patch("/reply/:id", ReplyControllers.update);
router.delete("/reply/:id", ReplyControllers.delete);

//likes router
router.get("/likes", LikeControllers.find);
router.get("/like/:id", AuthMiddleware.Authentication, LikeControllers.findOne);
router.post("/likes", AuthMiddleware.Authentication, LikeControllers.create);
router.delete("/like/:id", LikeControllers.delete);

export default router;
