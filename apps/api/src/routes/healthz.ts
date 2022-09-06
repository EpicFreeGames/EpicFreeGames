import { Router } from "express";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";

const router = Router();

router.get("/", endpointAuth(Flags.GetHealth), async (req, res) => {
  res.status(200).send("ok");
});

export const healthRouter = router;
