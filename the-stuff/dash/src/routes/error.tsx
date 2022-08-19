/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";

import { ErrorPageLayout } from "~components/ErrorPageLayout.tsx";

export default function ErrorPage(props: PageProps) {
  const error = props.url.searchParams.get("error");
  const message = props.url.searchParams.get("message");
  const statusCode = props.url.searchParams.get("statusCode");

  return (
    <ErrorPageLayout
      statusCode={statusCode ?? `${500}`}
      error={error ?? "unknown error"}
      message={message ?? "unknown error"}
    />
  );
}
