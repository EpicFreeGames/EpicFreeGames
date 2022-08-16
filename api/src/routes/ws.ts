import { Router } from "express";
import { config } from "../config";

const router = Router();

router.get("/", (req, res) => {
  res.json(config.EFG_API_WS_URL);
});

export const wsRouter = router;
