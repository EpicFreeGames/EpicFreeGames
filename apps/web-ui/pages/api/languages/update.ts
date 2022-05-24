import { ApiEndpoint } from "../../../utils/ApiEndpoint";
import { requireMethod } from "../../../utils/apiUtils";
import { hasAccess } from "../../../utils/auth";
import { botPublicKey, iendpointUrl, senderUrl } from "../../../utils/envs";

const HandlePost: ApiEndpoint = async (req, res) => {
  if (!requireMethod(req, res, "POST")) return;
  if (!(await hasAccess(req, res, false))) return;

  const ires = await fetch(`${iendpointUrl}/update-translations`, {
    method: "POST",
    body: JSON.stringify({
      secret: botPublicKey,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const senderRes = await fetch(`${senderUrl}/update-translations`, {
    method: "POST",
    body: JSON.stringify({
      secret: botPublicKey,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (ires.ok && senderRes.ok) return res.status(200).end();

  const message = `${!ires.ok ? "i-endpoint failed" : ""} ${!senderRes.ok ? "sender failed" : ""}`;

  return res.status(500).json({
    message,
  });
};

export default HandlePost;
