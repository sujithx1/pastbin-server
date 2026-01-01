import { Request, Response } from "express";
import { redis } from "../lib/redis";


export const getRedisPing = async (req: Request, res: Response) => {
    try {
        await redis.ping();
       return res.json({ ok: true });
    } catch {
       return res.status(500).json({ ok: false });
    }
}