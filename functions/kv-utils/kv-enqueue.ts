import { QueueMsg } from "../../models/queue-task.ts";
const kv = await Deno.openKv();

export async function enqueue(msg: QueueMsg) {
  await kv.enqueue(msg);
}
