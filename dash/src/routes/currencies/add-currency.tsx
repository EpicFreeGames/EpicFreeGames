/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "../../components/BackButton.tsx";
import { Input } from "../../components/Input.tsx";
import { Layout } from "../../components/layout.tsx";

export default function AddCurrencyPage() {
  return (
    <Layout title="Add a game">
      <div className={tw`flex gap-2 justify-between mb-3`}>
        <h1 className={tw`text-4xl`}>Add a currency</h1>

        <BackButton href="/currencies" />
      </div>

      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <form className={tw`flex flex-col gap-3`} method="POST">
          <Input name="code" label="Code" required />
          <Input name="name" label="Name" required />
          <Input name="apiValue" label="Api value" required />
          <Input name="inFrontOfPrice" label="In front of price" required />
          <Input name="afterPrice" label="After price" required />

          <div className={tw`flex gap-2 justify-between items-center`}>
            <a className={tw`btn bg-gray-600`} href="/currencies">
              Cancel
            </a>

            <button type="submit" className={tw`btn bg-gray-800`}>
              Add
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
