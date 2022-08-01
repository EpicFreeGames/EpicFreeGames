/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "twind";
import { Base } from "../components/base.tsx";

export default function NotFoundPage() {
  return (
    <Base title="Not found">
      <main className={tw`w-screen h-screen flex justify-center items-center`}>
        <h1
          className={tw`font-bold text-3xl p-3 bg-red-500 bg-opacity-50 rounded-md border-1 border-red-500`}
        >
          404 - Not found
        </h1>
      </main>
    </Base>
  );
}
