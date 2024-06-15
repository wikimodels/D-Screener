import { QueueMsg } from "../../models/queue-task.ts";
import { retryWithBackoff } from "./retry-with-backoff.ts";

export async function enqueue(msg: QueueMsg) {
  try {
    const kv = await Deno.openKv();
    await retryWithBackoff(async () => await kv.enqueue(msg));
    //await kv.enqueue(msg);
  } catch (e) {
    if (e.message.includes("database is locked")) {
      console.log("%cDB is FUCKED", "color: red");
    }
  }
}
