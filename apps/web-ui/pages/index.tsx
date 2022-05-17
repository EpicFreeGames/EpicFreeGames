import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import { Overview } from "../components/Overview/Overview";

const Home: NextPage = () => {
  return (
    <Layout>
      <Overview />
    </Layout>
  );
};

(Home as any).auth = true;

export default Home;
