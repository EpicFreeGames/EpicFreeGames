/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { Base } from "./base.tsx";

type Props = {
  statusCode: string;
  error: string;
  message: string;
};

export const ErrorPageLayout = ({ statusCode, error, message }: Props) => {
  const statusMessage = `${statusCode} - ${error}`;

  return (
    <Base title={statusMessage}>
      <main className={tw`w-screen h-screen flex flex-col justify-center items-center gap-4`}>
        <h1
          className={tw`font-bold text-3xl p-3 bg-red-500 bg-opacity-50 rounded-md border-1 border-red-500`}
        >
          {message}
        </h1>

        <p className={tw`text-center text-gray-500`}>{statusMessage}</p>
      </main>
    </Base>
  );
};
