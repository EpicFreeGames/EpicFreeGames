import axios from "axios";
import { config } from "config";
import { StatsResponse } from "shared";

export const getStatsFromClient = async () =>
  (await axios.get(config.clientUrl))?.data as StatsResponse;
