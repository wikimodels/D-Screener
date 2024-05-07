import { QueueMsg } from "../../models/queue-task.ts";

export async function enqueue(msg: QueueMsg) {
  const kv = await Deno.openKv();
  await kv.enqueue(msg);
}
