import path from "path";
import requestIp from "request-ip";
import { browserName, detectOS } from "detect-browser";
import isLocalhost from "is-localhost-ip";
import maxmind from "maxmind";

import {
  DESKTOP_OS,
  MOBILE_OS,
  DESKTOP_SCREEN_WIDTH,
  LAPTOP_SCREEN_WIDTH,
  MOBILE_SCREEN_WIDTH,
} from "./constants";
import { NextApiRequest } from "next";

let lookup;

export function getIpAddress(req: NextApiRequest): string {
  if (req.headers["cf-connecting-ip"]) {
    return req.headers["cf-connecting-ip"] as string;
  }

  return requestIp.getClientIp(req);
}

export function getDevice(screen: string, os: string) {
  if (!screen) {
    return;
  }

  const [width] = screen.split("x");
  const iWidth = parseInt(width, 10);

  if (DESKTOP_OS.includes(os)) {
    if (os === "Chrome OS" || iWidth < DESKTOP_SCREEN_WIDTH) {
      return "laptop";
    }

    return "desktop";
  } else if (MOBILE_OS.includes(os)) {
    if (os === "Amazon OS" || iWidth > MOBILE_SCREEN_WIDTH) {
      return "tablet";
    }

    return "mobile";
  }

  if (iWidth >= DESKTOP_SCREEN_WIDTH) {
    return "desktop";
  } else if (iWidth >= LAPTOP_SCREEN_WIDTH) {
    return "laptop";
  } else if (iWidth >= MOBILE_SCREEN_WIDTH) {
    return "tablet";
  }

  return "mobile";
}

export async function getCountry(req: NextApiRequest, ip: string) {
  if (req.headers["cf-ipcountry"]) {
    return req.headers["cf-ipcountry"];
  }

  if (await isLocalhost(ip)) {
    return;
  }

  if (!lookup) {
    lookup = await maxmind.open(
      path.resolve(".geolocalization/GeoLite2-Country.mmdb")
    );
  }

  return lookup.get(ip)?.country?.iso_code;
}

export async function getClientInfo(req: NextApiRequest, { screen }) {
  const userAgent = req.headers["user-agent"];
  const ip = getIpAddress(req);
  const country = await getCountry(req, ip);
  const browser = browserName(userAgent);
  const os = detectOS(userAgent);
  const device = getDevice(screen, os);

  return { userAgent, browser, os, ip, country, device };
}
