import { cleanKv } from "./functions/kv-utils/kv-clean.ts";
import { QueueTask } from "./models/queue-task.ts";
interface Task {
  kvNamespace: string;
  data: any;
}
async function enqueueS(task: Task) {
  const kv = await Deno.openKv(task.kvNamespace);
  kv.enqueue(task.data);
}
