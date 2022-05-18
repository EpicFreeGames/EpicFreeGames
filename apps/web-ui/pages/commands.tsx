import { NextPage } from "next";
import { Layout } from "../components/Layout";

const Commands: NextPage = () => <Layout title="Commands">Commands</Layout>;

(Commands as any).auth = true;

export default Commands;
