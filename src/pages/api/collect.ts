import joi from "joi";
import isBot from "isbot";
import api, { abort } from "../../lib/api";
import { uuid } from "../../lib/crypto";
import {
  createView,
  createViewSession,
  getViewSessionById,
} from "../../lib/queries";
import { getClientInfo } from "../../lib/request";

const schema = joi.object({
  auctionId: joi.string().uuid().required(),
  hostname: joi.string(),
  screen: joi.string(),
  language: joi.string(),
  referrer: joi.string(),
});

export default api().post(async (req, res) => {
  if (isBot(req.headers["user-agent"])) {
    return abort(204);
  }

  const { value, error } = schema.validate(req.body.payload);

  if (error) {
    return abort(400, error.details);
  }

  const { hostname, screen, language } = value;
  const client = await getClientInfo(req, value);
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

  await createView({
    viewSessionId: sessionId,
    auctionId: value.auctionId,
    referrer: value.referrer,
  });

  res.json({
    sessionId,
  });
});
