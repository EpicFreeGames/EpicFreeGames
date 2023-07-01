import { createTRPCReact } from "@trpc/react-query";
import type { RootRouter } from "../../../backend2/src/rootRouter";

export const trpc = createTRPCReact<RootRouter>();
