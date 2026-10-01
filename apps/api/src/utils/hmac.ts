import crypto from "node:crypto";
import { env } from "../env";

// API_KEY_ENC_SECRET must be 32 bytes, stored as 64 hex chars in your env
const secretHex = process.env.API_KEY_ENC_SECRET;
console.log("API_KEY_ENC_SECRET exists:", !!secretHex);
console.log("API_KEY_ENC_SECRET length:", secretHex?.length);
console.log(
  "API_KEY_ENC_SECRET valid hex:",
  secretHex ? /^[0-9a-fA-F]{64}$/.test(secretHex) : false,
);

if (!secretHex || !/^[0-9a-fA-F]{64}$/.test(secretHex)) {
  throw new Error(
    "API_KEY_ENC_SECRET must be exactly 64 hexadecimal characters",
  );
}
const secret = Buffer.from(secretHex, "hex");
console.log("AES key bytes:", secret.length);
export function encryptKey(plain: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secret, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, enc].map((b) => b.toString("hex")).join(":");
}

export function decryptKey(payload: string) {
  const [iv, tag, enc] = payload.split(":").map((h) => Buffer.from(h, "hex"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", secret, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
    "utf8",
  );
}
