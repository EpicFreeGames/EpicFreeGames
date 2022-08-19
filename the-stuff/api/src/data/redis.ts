import Redis from "ioredis";

import { config } from "../config";

let redis = new Redis({
  host: config.REDISHOST,
  port: config.REDISPORT,
  password: config.REDISPASS,
});

export default redis;
