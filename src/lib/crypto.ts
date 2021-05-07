import crypto from "crypto";
import { v4, v5 } from "uuid";
import { startOfMonth } from "date-fns";

const ROTATING_SALT = hash(startOfMonth(new Date()).toUTCString());

export function hash(...args: string[]) {
  return crypto.createHash("sha512").update(args.join("")).digest("hex");
}

export function secret() {
  return hash(process.env.HASH_SALT);
}

export function salt() {
  return v5([secret(), ROTATING_SALT].join(""), v5.DNS);
}

export function uuid(...args: string[]) {
  if (!args.length) return v4();

  return v5(args.join(""), salt());
}
