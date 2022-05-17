import type { NextPage } from "next";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div>test</div>
    </Layout>
  );
};

(Home as any).auth = true;

export default Home;
