/** @jsx h */
import { h } from "preact";
import { tw } from "twind";

import { Base } from "./Layout/base.tsx";

type Props = {
  statusCode: string;
  error: string;
  message: string;
};

export const ErrorPageLayout = ({ statusCode, error, message }: Props) => {
  const statusMessage = `${statusCode} - ${error}`;

  return (
    <Base title={statusMessage}>
      <main className={tw`flex h-screen w-screen flex-col items-center justify-center gap-4`}>
        <h1
          className={tw`border-1 rounded-md border-red-500 bg-red-500 bg-opacity-50 p-3 text-3xl font-bold`}
        >
          {message}
        </h1>

        <p className={tw`text-center text-gray-500`}>{statusMessage}</p>

        <a className={tw`btn-red-border mt-12`} href="/logout">
          Logout
        </a>
      </main>
    </Base>
  );
};
