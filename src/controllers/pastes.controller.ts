    import { NextFunction, Request, Response } from "express";
    import { nowMs } from "../lib/time";
    import { nanoid } from "nanoid";
    import { redis } from "../lib/redis";



  export const createPaste = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Invalid content" });
    }
    if (ttl_seconds && ttl_seconds < 1) {
      return res.status(400).json({ error: "Invalid ttl" });
    }
    if (max_views && max_views < 1) {
      return res.status(400).json({ error: "Invalid max_views" });
    }

    const id = nanoid(10);
    const now = nowMs(req);
    const key = `paste:${id}`;

    const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : "";

    // ✅ Store as HASH
    await redis.hset(key, {
      content,
      remaining_views: max_views ?? "",
      expires_at,
    });

    // ✅ Redis-level TTL
    if (ttl_seconds) {
      await redis.pexpire(key, ttl_seconds * 1000);
    }

    return res.status(201).json({
      id,
      url: `${process.env.BASE_URL}/p/${id}`,
    });
  } catch (error) {
    next(error);
  }
};




export const getPastes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = `paste:${req.params.id}`;

    const paste = await redis.hgetall<{
      content: string;
      remaining_views: string;
      expires_at: string;
    }>(key);

    if (!paste || !paste.content) {
      return res.status(404).json({ error: "Not found" });
    }

    const now = nowMs(req);

    const expiresAt = paste.expires_at ? Number(paste.expires_at) : null;
    let remainingViews =
      paste.remaining_views !== "" ? Number(paste.remaining_views) : null;

    // TTL check
    if (expiresAt && now >= expiresAt) {
      await redis.del(key);
      return res.status(404).json({ error: "Expired" });
    }

    // View limit check
    if (remainingViews !== null) {
      if (remainingViews <= 0) {
        return res.status(404).json({ error: "No views left" });
      }

      // ✅ Atomic decrement
      await redis.hincrby(key, "remaining_views", -1);
      remainingViews -= 1;
    }

    return res.status(200).json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
  } catch (error) {
    next(error);
  }
};
