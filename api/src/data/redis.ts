import { config } from "../config";
import Redis from "ioredis";

let redis = new Redis({
  host: config.REDISHOST,
  port: config.REDISPORT,
  password: config.REDISPASS,
});

export default redis;
