/** @jsx h */
import { h } from "preact";
import { ErrorPageLayout } from "~components/ErrorPageLayout.tsx";

export default function NotFoundPage() {
  return <ErrorPageLayout statusCode="404" error="Not Found" message="Page was not found" />;
}
