import isBot from "isbot";
import api, { abort } from "../../lib/api";
import { uuid } from "../../lib/crypto";
import {
  createView,
  createViewSession,
  getViewSessionById,
} from "../../lib/queries";
import { getClientInfo } from "../../lib/request";

export default api().post(async (req, res) => {
  if (isBot(req.headers["user-agent"])) {
    return abort(204);
  }

  const { type, hostname, screen, language } = req.body.payload;
  const client = await getClientInfo(req, req.body.payload);
  const { userAgent, browser, os, ip, country, device } = client;
  const sessionId = uuid(hostname, ip, userAgent, os);
  const session = await getViewSessionById(sessionId);

  if (!session) {
    await createViewSession({
      id: sessionId,
      hostname,
      browser,
      os,
      screen,
      language,
      country,
      device,
    });
  }

  if (type !== "auction_view") {
    return abort(400);
  }

  await createView({
    viewSessionId: sessionId,
    auctionId: req.body.payload.auctionId,
    referrer: req.body.payload.referrer,
  });

  res.json({
    sessionId,
  });
});
