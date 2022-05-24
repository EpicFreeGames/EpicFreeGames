import { ApiEndpoint } from "../../../utils/ApiEndpoint";
import { requireMethod } from "../../../utils/apiUtils";
import { hasAccess } from "../../../utils/auth";
import { senderUrl } from "../../../utils/envs";

const HandlePost: ApiEndpoint = async (req, res) => {
  if (!requireMethod(req, res, "POST")) return;
  if (!(await hasAccess(req, res, true))) return;

  const body = JSON.parse(req.body);
  const sendingId = body.sendingId;
  const gameIds = body.gameIds;

  const response = await fetch(senderUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sendingId, gameIds }),
  });

  const json = response ? await response.json() : null;

  res.status(response?.status ? response.status : 500).send(json);
};

export default HandlePost;
