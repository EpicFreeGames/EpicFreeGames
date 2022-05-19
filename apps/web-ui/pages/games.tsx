import { NextPage } from "next";
import { Card } from "../components/Card";
import { FlexDiv } from "../components/FlexDiv";
import { FreeGames } from "../components/Games/FreeGames";
import { NotConfirmedFreeGames } from "../components/Games/NotConfirmedGames";
import { UpcomingFreeGames } from "../components/Games/UpcomingGames";
import { Layout } from "../components/Layout";
import { CardTitle } from "../components/Text";

const GamesPage: NextPage = () => (
  <Layout title="Games">
    <FlexDiv column gap05>
      <Card variant="dark">
        <CardTitle>Free games</CardTitle>

        <FreeGames />
      </Card>

      <Card variant="dark">
        <CardTitle>Upcoming free games</CardTitle>

        <UpcomingFreeGames />
      </Card>

      <Card variant="dark">
        <CardTitle>Not confirmed free games</CardTitle>

        <NotConfirmedFreeGames />
      </Card>
    </FlexDiv>
  </Layout>
);
export default GamesPage;
