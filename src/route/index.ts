import * as express from "express";
import ThreadControllers from "../controllers/ThreadControllers";
import UserControllers from "../controllers/UserControllers";
import ReplyControllers from "../controllers/ReplyControllers";
import LikeControllers from "../controllers/LikeControllers";

const router = express.Router();

//thread router
router.get("/threads", ThreadControllers.find)
router.get("/thread/:id", ThreadControllers.findOne)
router.post("/thread", ThreadControllers.create)
router.patch("/thread/:id", ThreadControllers.update)
router.delete("/thread/:id", ThreadControllers.delete)

//user router
router.get("/users", UserControllers.find)
router.get("/user/:id", UserControllers.findOne)
router.post("/users", UserControllers.create)
router.patch("/user/:id", UserControllers.update)
router.delete("/user/:id", UserControllers.delete)

//reply router
router.get("/replies", ReplyControllers.find)
router.get("/reply/:id", ReplyControllers.findOne)
router.post("/replies", ReplyControllers.create)
router.patch("/reply/:id", ReplyControllers.update)
router.delete("/reply/:id", ReplyControllers.delete)

//likes router
router.get("/likes", LikeControllers.find)
router.get("/like/:id", LikeControllers.findOne)
router.post("/likes", LikeControllers.create)
router.delete("/like/:id", LikeControllers.delete)

export default router;