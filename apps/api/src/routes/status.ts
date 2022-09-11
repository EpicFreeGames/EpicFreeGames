import { Router } from "express";
import {configuration} from '@efg/configuration'

const router = Router();

router.get("/", async (req, res) => res.status(200).json({status: "healthy", version: configuration.VERSION}));

export const statusRouter = router;
