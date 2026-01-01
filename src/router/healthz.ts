import { Router } from "express";
import { getRedisPing } from "../controllers/healthz.controller";

const router = Router();

router.get("/", getRedisPing); 

export default router;
