import axios from "axios";
import { config } from "config";

export const getGuildCount = async () => (await axios.get(config.clientUrl))?.data?.guildCount;
