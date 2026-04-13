import { seedWisdomHub } from "./lib/actions/blog";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  try {
    const res = await seedWisdomHub();
    console.log("Seed result:", res);
  } catch (e) {
    console.error("Seed failed:", e);
  }
}
run();
