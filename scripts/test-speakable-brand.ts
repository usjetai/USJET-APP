/**
 * Lightweight assertions for speakable brand text transforms.
 * Run: npx tsx scripts/test-speakable-brand.ts
 */
import { toSpeakableText, USJET_SPOKEN } from "../src/lib/speakableBrand";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(toSpeakableText("USJET Origin online") === `${USJET_SPOKEN} Origin online`, "USJET token");
assert(
  toSpeakableText("Visit USJET.AI today") === `Visit ${USJET_SPOKEN} dot A I today`,
  "USJET.AI token",
);
assert(toSpeakableText("usjet.ai hangar") === `${USJET_SPOKEN} dot A I hangar`, "lowercase domain");
assert(toSpeakableText("US Jet command") === `${USJET_SPOKEN} command`, "spaced brand");

console.log("speakableBrand: all assertions passed");
