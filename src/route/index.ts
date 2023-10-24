import * as express from "express";
import ThreadControllers from "../controllers/ThreadControllers";

const router = express.Router();

router.get("/threads", ThreadControllers.find)
router.get("/thread/:id", ThreadControllers.findOne)
router.post("/thread", ThreadControllers.create)
router.patch("/thread/:id", ThreadControllers.update)
router.delete("/thread/:id", ThreadControllers.delete)

export default router;