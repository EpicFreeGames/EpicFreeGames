import { Layout } from "~components/Layout/Layout";
import { AddSending } from "~components/Sends/AddSending";

export default function SendsPage() {
  return <Layout title="Sends" titleButtons={[AddSending]}></Layout>;
}
