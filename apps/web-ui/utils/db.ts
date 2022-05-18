import { db } from "database";
import { mongoUrl } from "./envs";

export const dbConnect = () => db.connect(mongoUrl);
