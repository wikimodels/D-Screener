import { retryWithBackoff } from "./retry-with-backoff.ts";

export async function cleanKv() {
  try {
    const kv = await Deno.openKv();
    const entries = kv.list({ prefix: [] });
    let counter = 0;
    for await (const item of entries) {
      await retryWithBackoff(async () => await kv.delete(item.key));
      counter++;
    }
    console.log(`%cKVDB ---> ${counter} items deleted`, "color: yellow");
  } catch (e) {
    console.log(e.message, e.code);
  }
}
