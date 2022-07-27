/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { Layout } from "../../components/layout.tsx";
import { User } from "./_middleware.ts";

export default function GamesPage({ data }: PageProps<User | null>) {
  return (
    <Layout title="Games">
      <h1>Games</h1>
    </Layout>
  );
}
