import { QueueTask } from "../../models/queue-task.ts";

export async function enqueue(task: QueueTask) {
  const kv = await Deno.openKv(task.kvNamespace);
  await kv.enqueue(task.msg);
}
