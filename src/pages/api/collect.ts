import isBot from "isbot";
import api, { abort } from "../../lib/api";
import { uuid } from "../../lib/crypto";
import { getClientInfo } from "../../lib/request";
import { createAuctionView } from "../../queries/AuctionViews";
import { createSession, getSessionById } from "../../queries/Sessions";

export default api.post(async (req, res) => {
  if (isBot(req.headers["user-agent"])) {
    return abort(204);
  }

  const { type, hostname, screen, language } = req.body.payload;
  const client = await getClientInfo(req, req.body.payload);
  const { userAgent, browser, os, ip, country, device } = client;
  const session_id = uuid(hostname, ip, userAgent, os);
  const session = await getSessionById(session_id);

  if (!session) {
    await createSession({
      id: session_id,
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

  await createAuctionView({
    session_id,
    auction_id: req.body.payload.auction_id,
    referrer: req.body.payload.referrer,
  });

  res.json({
    session_id,
  });
});
