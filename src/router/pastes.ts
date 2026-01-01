import { Router } from "express";
import { createPaste, getPastes } from "../controllers/pastes.controller";


const router = Router();

/* CREATE */
router.post("/",createPaste)

/* FETCH */
router.get("/:id", getPastes);

export default router;
