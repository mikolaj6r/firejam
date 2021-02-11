import crypto from "crypto";

export function generateSalt(rounds: number = 12) {
  if (rounds && rounds >= 15) {
    throw new Error(`${rounds} is greater than 15,Must be less that 15`);
  }

  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString("hex")
    .slice(0, rounds);
}

function hasher(stringToHash: string, salt: string) {
  let hash = crypto.createHmac("sha256", salt);
  hash.update(stringToHash);
  let value = hash.digest("hex");
  return {
    salt: salt,
    hashedString: value,
  };
}

export function hash(stringToHash: string) {
  if (stringToHash == null) {
    throw new Error("Must stringToHash values");
  }
  return hasher(stringToHash, generateSalt());
}

export function compare(
  stringToHash: string,
  hash: { salt: string; hashedString: string }
) {
  if (stringToHash == null || hash == null) {
    throw new Error("stringToHash and hash is required to compare");
  }
  if (typeof stringToHash !== "string" || typeof hash !== "object") {
    throw new Error("stringToHash must be a String and hash must be an Object");
  }
  let dataToCompare = hasher(stringToHash, hash.salt);
  if (dataToCompare.hashedString === hash.hashedString) {
    return true;
  }
  return false;
}
