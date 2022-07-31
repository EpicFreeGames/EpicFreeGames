/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { Layout } from "../../components/layout.tsx";

export default function I18nPage() {
  return (
    <Layout title="I18n">
      <div className={tw`flex gap-2 justify-between mb-4`}>
        <h1 className={tw`flex justify-center items-center text-3xl md:text-4xl`}>Currencies</h1>

        <a className={tw`btn bg-gray-700`} href="/currencies/add-currency">
          Add a currency
        </a>
      </div>
    </Layout>
  );
}
